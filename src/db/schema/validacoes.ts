import { pgTable, uuid, varchar, text, jsonb, index } from 'drizzle-orm/pg-core';
import { projetos } from './projetos';
import { moveis } from './moveis';
import { enterpriseColumns } from './base';

export const validacoes = pgTable('validacoes', {
  id: uuid('id').primaryKey().defaultRandom(),
  projetoId: uuid('projeto_id').notNull().references(() => projetos.id, { onDelete: 'cascade' }),
  movelId: uuid('movel_id').references(() => moveis.id, { onDelete: 'cascade' }),
  tipoValidacao: varchar('tipo_validacao', { length: 100 }).notNull(), // estrutural, dimensional, conflito
  status: varchar('status', { length: 50 }).notNull(), // passou, falhou, alerta
  detalhes: jsonb('detalhes').notNull(), // Detalhes do erro estrutural para a engenharia paramétrica
  ...enterpriseColumns,
}, (table) => {
  return {
    projetoIdx: index('validacoes_projeto_id_idx').on(table.projetoId),
    movelIdx: index('validacoes_movel_id_idx').on(table.movelId),
    statusIdx: index('validacoes_status_idx').on(table.status),
  };
});
