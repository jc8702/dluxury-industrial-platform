import { genAI } from '@/lib/ai/client';
import { VectorStore } from '../infrastructure/vector-store';
import { RAGDocumentChunk } from '../domain/types';

export class DocumentIngestionService {
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

  public static async ingestIndustrialDocument(
    empresaId: string,
    sourceId: string,
    rawText: string,
    type: RAGDocumentChunk['metadata']['type']
  ) {
    const chunks = this.chunkText(rawText);
    const model = genAI.getGenerativeModel({ model: 'text-embedding-004' });

    for (let i = 0; i < chunks.length; i++) {
      const result = await model.embedContent({
        content: { parts: [{ text: chunks[i] }] },
        taskType: 'RETRIEVAL_DOCUMENT',
      } as any);
      const chunkDoc: RAGDocumentChunk = {
        content: chunks[i],
        embedding: result.embedding.values,
        metadata: { sourceId, type, pageNumber: i + 1 },
      };
      await VectorStore.saveChunk(empresaId, chunkDoc);
    }

    return { success: true, chunksProcessed: chunks.length };
  }
}