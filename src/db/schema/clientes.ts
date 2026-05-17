import { pgTable, uuid, varchar, text, index } from 'drizzle-orm/pg-core';
import { empresas } from './empresas';
import { enterpriseColumns } from './base';

export const clientes = pgTable('clientes', {
  id: uuid('id').primaryKey().defaultRandom(),
  empresaId: uuid('empresa_id').notNull().references(() => empresas.id, { onDelete: 'cascade' }),
  nome: varchar('nome', { length: 255 }).notNull(),
  documento: varchar('documento', { length: 50 }),
  email: varchar('email', { length: 255 }),
  telefone: varchar('telefone', { length: 50 }),
  endereco: text('endereco'),
  ...enterpriseColumns,
}, (table) => {
  return {
    empresaIdx: index('clientes_empresa_id_idx').on(table.empresaId),
    nomeIdx: index('clientes_nome_idx').on(table.nome),
  };
});
