import { pgTable, uuid, varchar, text, index, timestamp, boolean } from 'drizzle-orm/pg-core';
import { empresas } from './empresas';
import { pecas } from './pecas';
import { producao } from './producao';
import { enterpriseColumns } from './base';

export const rastreabilidadePecas = pgTable('rastreabilidade_pecas', {
  id: uuid('id').primaryKey().defaultRandom(),
  empresaId: uuid('empresa_id').notNull().references(() => empresas.id, { onDelete: 'cascade' }),
  producaoId: uuid('producao_id').notNull().references(() => producao.id, { onDelete: 'cascade' }),
  pecaId: uuid('peca_id').notNull().references(() => pecas.id, { onDelete: 'cascade' }),
  
  codigoBarras: varchar('codigo_barras', { length: 100 }).notNull().unique(), // EAN ou UUID reduzido
  
  // Workflow da peça
  statusCorte: boolean('status_corte').default(false).notNull(),
  statusBorda: boolean('status_borda').default(false).notNull(),
  statusFuro: boolean('status_furo').default(false).notNull(),
  statusMontagem: boolean('status_montagem').default(false).notNull(),
  statusExpedicao: boolean('status_expedicao').default(false).notNull(),
  
  dataUltimaLeitura: timestamp('data_ultima_leitura', { mode: 'date' }),
  maquinaUltimaLeitura: varchar('maquina_ultima_leitura', { length: 100 }), // ID ou Nome da CNC/Seccionadora
  
  ...enterpriseColumns,
}, (table) => {
  return {
    empresaIdx: index('rastreabilidade_empresa_idx').on(table.empresaId),
    codigoIdx: index('rastreabilidade_codigo_idx').on(table.codigoBarras),
    producaoIdx: index('rastreabilidade_producao_idx').on(table.producaoId),
  };
});

export const apontamentoLogs = pgTable('apontamento_logs', {
  id: uuid('id').primaryKey().defaultRandom(),
  rastreabilidadeId: uuid('rastreabilidade_id').notNull().references(() => rastreabilidadePecas.id, { onDelete: 'cascade' }),
  etapa: varchar('etapa', { length: 50 }).notNull(), // corte, borda, furo, embalagem
  operadorId: uuid('operador_id').notNull(),
  dataApontamento: timestamp('data_apontamento', { mode: 'date' }).defaultNow().notNull(),
  observacao: text('observacao'),
});
