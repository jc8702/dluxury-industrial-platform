import { pgTable, uuid, varchar, text, decimal, timestamp, index, jsonb } from 'drizzle-orm/pg-core';
import { empresas } from './empresas';
import { clientes } from './clientes';
import { enterpriseColumns } from './base';

export const projetos = pgTable('projetos', {
  id: uuid('id').primaryKey().defaultRandom(),
  empresaId: uuid('empresa_id').notNull().references(() => empresas.id, { onDelete: 'cascade' }),
  clienteId: uuid('cliente_id').notNull().references(() => clientes.id, { onDelete: 'restrict' }),
  nome: varchar('nome', { length: 255 }).notNull(),
  status: varchar('status', { length: 50 }).notNull().default('orcamento'), // orcamento, aprovado, producao, finalizado
  valorTotal: decimal('valor_total', { precision: 12, scale: 2 }),
  dataEntrega: timestamp('data_entrega', { mode: 'date' }),
  notas: text('notas'),
  metadados: jsonb('metadados'),
  ...enterpriseColumns,
}, (table) => {
  return {
    empresaIdx: index('projetos_empresa_id_idx').on(table.empresaId),
    clienteIdx: index('projetos_cliente_id_idx').on(table.clienteId),
    statusIdx: index('projetos_status_idx').on(table.status),
  };
});
