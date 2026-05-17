import { pgTable, uuid, varchar, index, timestamp } from 'drizzle-orm/pg-core';
import { projetos } from './projetos';
import { empresas } from './empresas';
import { enterpriseColumns } from './base';

export const producao = pgTable('producao', {
  id: uuid('id').primaryKey().defaultRandom(),
  empresaId: uuid('empresa_id').notNull().references(() => empresas.id, { onDelete: 'cascade' }),
  projetoId: uuid('projeto_id').notNull().references(() => projetos.id, { onDelete: 'cascade' }),
  status: varchar('status', { length: 50 }).notNull().default('aguardando'), // aguardando, corte, borda, furacao, montagem, expedicao
  dataInicio: timestamp('data_inicio', { mode: 'date' }),
  dataFim: timestamp('data_fim', { mode: 'date' }),
  ...enterpriseColumns,
}, (table) => {
  return {
    empresaIdx: index('producao_empresa_id_idx').on(table.empresaId),
    projetoIdx: index('producao_projeto_id_idx').on(table.projetoId),
    statusIdx: index('producao_status_idx').on(table.status),
  };
});
