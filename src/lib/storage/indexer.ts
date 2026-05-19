import { db } from '@/db';
import { documentosTecnicos } from '@/db/schema/documentos';
import { embeddingsIa } from '@/db/schema/embeddings';
import { gerarEmbedding } from '@/lib/ai/embeddings';
import { chunkTechnicalDocument } from '@/lib/ai/chunking';
import { logSecurityEvent } from '@/lib/auth/security-logs';
import { eq } from 'drizzle-orm';
import { google } from '@ai-sdk/google';
import { generateText } from 'ai';

/**
 * Enterprise Storage Indexer Pipeline
 * 1. Simula OCR ou extração de texto (Preparado para Gemini Multimodal 1.5/2.5)
 * 2. Faz o chunking técnico
 * 3. Cria embeddings
 * 4. Salva os chunks no pgvector e altera o status do documento
 */
export async function processDocumentPipeline(documentId: string, empresaId: string) {
  try {
    const [doc] = await db
      .select()
      .from(documentosTecnicos)
      .where(eq(documentosTecnicos.id, documentId));

    if (!doc) throw new Error('Documento não encontrado');

    // FETCH DO ARQUIVO NO STORAGE (Cloudflare R2)
    const fileResponse = await fetch(doc.url);
    if (!fileResponse.ok) throw new Error("Falha ao baixar arquivo do R2");
    
    const arrayBuffer = await fileResponse.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // OCR ROBUSTO MULTIMODAL COM GEMINI 2.5 PRO
    // O Gemini extrai não só texto, mas entende diagramas de montagem de ferragens!
    const { text: extractedText } = await generateText({
      model: google('gemini-2.5-pro'),
      messages: [
        { 
          role: 'user', 
          content: [
            // @ts-ignore
            { type: 'file', data: buffer, mimeType: doc.mimeType || 'application/pdf' },
            { type: 'text', text: 'Você é um Especialista CAD/CAM de Marcenaria. Analise este documento técnico e extraia ABSOLUTAMENTE TUDO em formato texto: Medidas, furações, gabaritos, distâncias de eixos, regras de instalação e descritivos. Mantenha os valores numéricos com extrema precisão.' }
          ] 
        }
      ]
    });
    
    // Atualiza status e versionamento
    await db.update(documentosTecnicos)
      .set({ 
        statusIndexacao: 'ocr_concluido',
        versao: doc.versao + 1 // Versionamento automático na indexação
      })
      .where(eq(documentosTecnicos.id, doc.id));

    // Chunking e Vetorização com o Embedding 004 do Google
    const chunks = chunkTechnicalDocument(extractedText);

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

    // Inserção em Lote no PGVector
    if (chunkData.length > 0) {
      await db.insert(embeddingsIa).values(chunkData);
    }

    // Atualiza status final
    await db.update(documentosTecnicos)
      .set({ statusIndexacao: 'vetorizado' })
      .where(eq(documentosTecnicos.id, doc.id));

    await logSecurityEvent({
      tabela: 'documentos_tecnicos',
      acao: 'document_indexed_success',
      // @ts-ignore
      registroId: doc.id,
      dadosNovos: { chunks_criados: chunks.length }
    });

  } catch (error) {
    console.error('Falha na indexação do documento:', error);
    await db.update(documentosTecnicos)
      .set({ statusIndexacao: 'erro' })
      .where(eq(documentosTecnicos.id, documentId));
  }
}
