import { db } from '@/db';
import { embeddingsIa } from '@/db/schema/embeddings';
import { sql, desc } from 'drizzle-orm';
import { RAGDocumentChunk } from '../domain/types';

export class VectorStore {
  
  /**
   * Salva um Chunk de texto vetorizado no Neon PostgreSQL via pgvector
   */
  static async saveChunk(empresaId: string, chunk: RAGDocumentChunk) {
    if (!chunk.embedding) throw new Error("Chunk missing embedding array");

    // Pgvector requer formatação string [1.0, 2.0, 3.0]
    const embeddingStr = `[${chunk.embedding.join(',')}]`;

    await db.insert(embeddingsIa).values({
      empresaId,
      documentoId: chunk.metadata.sourceId, // ID lógico do PDF/Origem
      conteudoTexto: chunk.content,
      embedding: embeddingStr as any,
      metadados: chunk.metadata
    });
  }

  /**
   * Executa busca de similaridade (Cosine Distance <=> 1 - dot_product) no pgvector
   * Retorna os 5 fragmentos mais relevantes para o prompt do Gemini
   */
  static async findSimilar(empresaId: string, queryEmbedding: number[], limit = 5) {
    const embeddingStr = `[${queryEmbedding.join(',')}]`;
    
    // Calcula a Distância de Cosseno usando o operador '<=>' do pgvector
    const similarityQuery = sql`1 - (${embeddingsIa.embedding} <=> ${embeddingStr}::vector)`;

    const results = await db
      .select({
        conteudoTexto: embeddingsIa.conteudoTexto,
        metadados: embeddingsIa.metadados,
        similarity: similarityQuery
      })
      .from(embeddingsIa)
      .where(sql`${embeddingsIa.empresaId} = ${empresaId}`)
      .orderBy(desc(similarityQuery))
      .limit(limit);

    return results;
  }
}
