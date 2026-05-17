import { embed, embedMany } from 'ai';
import { google } from '@ai-sdk/google';
import { db } from '@/db';
import { embeddingsIa } from '@/db/schema/embeddings';
import { cosineDistance, desc, sql } from 'drizzle-orm';

// O modelo recomendado pelo Google para geração de vetores atualmente
const embeddingModel = google.textEmbeddingModel('text-embedding-004');

export async function generateEmbedding(text: string) {
  const { embedding } = await embed({
    model: embeddingModel,
    value: text,
  });
  return embedding;
}

export async function generateEmbeddings(texts: string[]) {
  const { embeddings } = await embedMany({
    model: embeddingModel,
    values: texts,
  });
  return embeddings;
}

export interface RetrievalOptions {
  empresaId: string;
  entidadeTipo?: string; // Filtrar por 'manual', 'peca', 'ferragem'
  limit?: number;
  similarityThreshold?: number;
}

/**
 * RAG Pipeline: Recupera contexto técnico do banco de dados vetorial (pgvector)
 * usando a distância coseno (HNSW index) e previne alucinações.
 */
export async function retrieveTechnicalContext(
  query: string, 
  options: RetrievalOptions
) {
  const queryEmbedding = await generateEmbedding(query);
  const similarity = sql<number>`1 - (${cosineDistance(
    embeddingsIa.embedding,
    queryEmbedding
  )})`;

  // Define limite mínimo de similaridade rigoroso para contexto técnico
  const threshold = options.similarityThreshold || 0.75;

  const results = await db
    .select({
      id: embeddingsIa.id,
      entidadeTipo: embeddingsIa.entidadeTipo,
      conteudo: embeddingsIa.conteudoTexto,
      similarity,
    })
    .from(embeddingsIa)
    .where(
      sql`${embeddingsIa.empresaId} = ${options.empresaId} AND ${similarity} > ${threshold}`
      // Pode-se adicionar dinamicamente o filtro de entidade_tipo se preenchido
    )
    .orderBy(desc(similarity))
    .limit(options.limit || 5);

  return results.map((r) => r.conteudo).join('\n\n---\n\n');
}
