import { pgTable, uuid, varchar, integer, timestamp, index, uniqueIndex } from 'drizzle-orm/pg-core';
import { empresas } from './empresas';
import { enterpriseColumns } from './base';

export const planos = pgTable('planos', {
  id: varchar('id', { length: 50 }).primaryKey(), // 'starter', 'pro', 'enterprise'
  nome: varchar('nome', { length: 255 }).notNull(),
  limiteUsuarios: integer('limite_usuarios').notNull(),
  limiteProjetos: integer('limite_projetos').notNull(),
  limiteStorageMb: integer('limite_storage_mb').notNull(),
  limiteAiTokens: integer('limite_ai_tokens').notNull(),
  stripePriceId: varchar('stripe_price_id', { length: 255 }),
});

export const usoRecursos = pgTable('uso_recursos', {
  id: uuid('id').primaryKey().defaultRandom(),
  empresaId: uuid('empresa_id').notNull().references(() => empresas.id, { onDelete: 'cascade' }),
  periodo: varchar('periodo', { length: 7 }).notNull(), // '2023-10'
  
  usuariosAtivos: integer('usuarios_ativos').default(0).notNull(),
  projetosCriados: integer('projetos_criados').default(0).notNull(),
  storageUtilizadoMb: integer('storage_utilizado_mb').default(0).notNull(),
  aiTokensUtilizados: integer('ai_tokens_utilizados').default(0).notNull(),
  
  ...enterpriseColumns,
}, (table) => {
  return {
    tenantPeriodoIdx: uniqueIndex('uso_recursos_tenant_periodo_idx').on(table.empresaId, table.periodo),
    empresaIdx: index('uso_recursos_empresa_idx').on(table.empresaId),
  };
});
