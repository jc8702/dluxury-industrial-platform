import { embed, embedMany } from 'ai';
import { google } from '@/lib/ai/client';
import { VectorStore } from '../infrastructure/vector-store';
import { RAGDocumentChunk } from '../domain/types';
// Simulando o import pdf-parse para leitura de Manuais de Ferragem
// import pdf from 'pdf-parse'; 

export class DocumentIngestionService {
  
  /**
   * Recebe um texto longo (ex: Manual de Montagem PDF extraído) e faz o "Chunking" semântico
   * Quebra em blocos de ~1000 caracteres respeitando parágrafos.
   */
  private static chunkText(text: string, chunkSize = 1000): string[] {
    const chunks: string[] = [];
    const paragraphs = text.split('\n\n');
    let currentChunk = '';

    for (const p of paragraphs) {
      if (currentChunk.length + p.length > chunkSize) {
        chunks.push(currentChunk);
        currentChunk = p;
      } else {
        currentChunk += '\n\n' + p;
      }
    }
    if (currentChunk) chunks.push(currentChunk);

    return chunks;
  }

  /**
   * Processa um documento industrial, vetoriza com Gemini Embeddings e salva no Neon DB
   */
  public static async ingestIndustrialDocument(
    empresaId: string, 
    sourceId: string, 
    rawText: string, 
    type: RAGDocumentChunk['metadata']['type']
  ) {
    const chunks = this.chunkText(rawText);

    // Usa o modelo gemini-embedding-001 do Google configurado para 768 dimensões
    const { embeddings } = await embedMany({
      model: google.textEmbeddingModel('gemini-embedding-001'),
      values: chunks,
      providerOptions: {
        google: {
          outputDimensionality: 768,
        },
      },
    });

    // Salvar no Banco Vetorial
    for (let i = 0; i < chunks.length; i++) {
      const chunkDoc: RAGDocumentChunk = {
        content: chunks[i],
        embedding: embeddings[i],
        metadata: {
          sourceId,
          type,
          pageNumber: i + 1 // simplificação
        }
      };

      await VectorStore.saveChunk(empresaId, chunkDoc);
    }
    
    return { success: true, chunksProcessed: chunks.length };
  }
}
