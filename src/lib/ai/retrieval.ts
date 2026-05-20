import { sql } from 'drizzle-orm';
import { db } from '@/db';
import { embeddingsIa } from '@/db/schema';
import { gerarEmbedding } from './embeddings';

export interface ContextoResultado {
  conteudoTexto: string;
  entidadeTipo: string;
  entidadeId: string;
  similarity: number;
}

/**
 * Realiza uma busca semântica de similaridade de cosseno usando pgvector no Neon Postgres.
 * Garante o isolamento multi-tenant obrigatório validando pelo empresaId.
 * 
 * @param empresaId ID da empresa proprietária dos dados (Isolamento RLS/SaaS)
 * @param embedding Vetor de 768 dimensões gerado pelo Gemini
 * @param limit Limite máximo de blocos de contexto retornados
 * @param minSimilarity Limiar mínimo de similaridade de cosseno (de 0.0 a 1.0)
 */
export async function buscarContextoSemantico(
  empresaId: string,
  embedding: number[],
  limit = 4,
  minSimilarity = 0.65
): Promise<ContextoResultado[]> {
  try {
    // 1. Converter a array de float em uma string formatada de vetor para o Postgres: "[0.12, 0.34, ...]"
    const vectorStr = `[${embedding.join(',')}]`;
    const maxDistance = 1 - minSimilarity;

    // 2. Executar a query de similaridade de cosseno (operador <=> do pgvector)
    const results = await db
      .select({
        conteudoTexto: embeddingsIa.conteudoTexto,
        entidadeTipo: embeddingsIa.entidadeTipo,
        entidadeId: embeddingsIa.entidadeId,
        similarity: sql<number>`1 - (${embeddingsIa.embedding} <=> ${vectorStr}::vector)`,
      })
      .from(embeddingsIa)
      .where(
        sql`${embeddingsIa.empresaId} = ${empresaId} 
        AND (${embeddingsIa.embedding} <=> ${vectorStr}::vector) <= ${maxDistance}`
      )
      .orderBy(sql`${embeddingsIa.embedding} <=> ${vectorStr}::vector`)
      .limit(limit);

    return results as ContextoResultado[];
  } catch (error) {
    console.error('Erro na busca semântica RAG (pgvector):', error);
    return []; // Retorna lista vazia preventivamente para evitar travar o fluxo de chat
  }
}

/**
 * Função de conveniência para buscar o contexto semântico formatado como texto corrido
 */
export async function retrieveTechnicalContext(
  query: string,
  options: { empresaId: string; limit?: number; similarityThreshold?: number }
): Promise<string> {
  try {
    const embedding = await gerarEmbedding(query);
    const results = await buscarContextoSemantico(
      options.empresaId,
      embedding,
      options.limit ?? 3,
      options.similarityThreshold ?? 0.65
    );
    if (results.length === 0) return '';
    return results.map(r => r.conteudoTexto).join('\n\n---\n\n');
  } catch (error) {
    console.error('Erro ao recuperar contexto técnico para a ação do Chat:', error);
    return '';
  }
}
