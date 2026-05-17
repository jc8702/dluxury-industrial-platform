import { pgTable, uuid, varchar, text, index } from 'drizzle-orm/pg-core';
import { empresas } from './empresas';
import { enterpriseColumns } from './base';

// Gemini embeddings are 768 dimensions typically
// Drizzle supports vector natively via pgvector
import { vector } from 'drizzle-orm/pg-core';

export const embeddingsIa = pgTable('embeddings_ia', {
  id: uuid('id').primaryKey().defaultRandom(),
  empresaId: uuid('empresa_id').notNull().references(() => empresas.id, { onDelete: 'cascade' }),
  entidadeTipo: varchar('entidade_tipo', { length: 100 }).notNull(), // projeto, peca, material, manual, etc
  entidadeId: uuid('entidade_id').notNull(),
  conteudoTexto: text('conteudo_texto').notNull(),
  embedding: vector('embedding', { dimensions: 768 }).notNull(),
  ...enterpriseColumns,
}, (table) => {
  return {
    empresaIdx: index('embeddings_ia_empresa_id_idx').on(table.empresaId),
    entidadeIdx: index('embeddings_ia_entidade_idx').on(table.entidadeTipo, table.entidadeId),
    // HNSW index for fast similarity search
    embeddingIndex: index('embedding_hnsw_idx')
      .using('hnsw', table.embedding.op('vector_cosine_ops')),
  };
});
