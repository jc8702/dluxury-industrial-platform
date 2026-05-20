import { db } from '@/db';
import { documentosTecnicos } from '@/db/schema/documentos';
import { embeddingsIa } from '@/db/schema/embeddings';
import { gerarEmbedding } from '@/lib/ai/embeddings';
import { chunkTechnicalDocument } from '@/lib/ai/chunking';
import { logSecurityEvent } from '@/lib/auth/security-logs';
import { eq } from 'drizzle-orm';
import { genAI } from '@/lib/ai/client';

export async function processDocumentPipeline(documentId: string, empresaId: string) {
  try {
    const [doc] = await db
      .select()
      .from(documentosTecnicos)
      .where(eq(documentosTecnicos.id, documentId));

    if (!doc) throw new Error('Documento não encontrado');

    const fileResponse = await fetch(doc.url);
    if (!fileResponse.ok) throw new Error("Falha ao baixar arquivo do R2");

    const text = await fileResponse.text();

    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-lite' });
    const extractedText = await model.generateContent(
      `Você é um Especialista CAD/CAM de Marcenaria. Analise este documento técnico e extraia ABSOLUTAMENTE TUDO em formato texto: Medidas, furações, gabaritos, distâncias de eixos, regras de instalação e descritivos. Mantenha os valores numéricos.\n\n${text.substring(0, 10000)}`
    );

    const extracted = extractedText.response.text();

    await db.update(documentosTecnicos)
      .set({ statusIndexacao: 'ocr_concluido', versao: doc.versao + 1 })
      .where(eq(documentosTecnicos.id, doc.id));

    const chunks = chunkTechnicalDocument(extracted);

    const chunkData = await Promise.all(chunks.map(async (chunk) => {
      const emb = await gerarEmbedding(chunk);
      return {
        empresaId,
        entidadeTipo: 'manual_tecnico',
        entidadeId: doc.id,
        conteudoTexto: chunk,
        embedding: emb as any,
      };
    }));

    if (chunkData.length > 0) {
      await db.insert(embeddingsIa).values(chunkData);
    }

    await db.update(documentosTecnicos)
      .set({ statusIndexacao: 'vetorizado' })
      .where(eq(documentosTecnicos.id, doc.id));

    await logSecurityEvent({
      tabela: 'documentos_tecnicos',
      acao: 'document_indexed_success',
      usuarioId: undefined,
      dadosNovos: { chunks_criados: chunks.length }
    });
  } catch (error) {
    console.error('Falha na indexação do documento:', error);
    await db.update(documentosTecnicos)
      .set({ statusIndexacao: 'erro' })
      .where(eq(documentosTecnicos.id, documentId));
  }
}