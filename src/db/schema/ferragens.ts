import { pgTable, uuid, varchar, decimal, index } from 'drizzle-orm/pg-core';
import { empresas } from './empresas';
import { enterpriseColumns } from './base';

export const ferragens = pgTable('ferragens', {
  id: uuid('id').primaryKey().defaultRandom(),
  empresaId: uuid('empresa_id').notNull().references(() => empresas.id, { onDelete: 'cascade' }),
  nome: varchar('nome', { length: 255 }).notNull(), // Dobradiça reta, Corrediça telescópica 450mm
  tipo: varchar('tipo', { length: 100 }), // fixacao, articulacao, deslizamento, acessorio
  precoUnidade: decimal('preco_unidade', { precision: 10, scale: 2 }),
  codigoFabricante: varchar('codigo_fabricante', { length: 100 }),
  ...enterpriseColumns,
}, (table) => {
  return {
    empresaIdx: index('ferragens_empresa_id_idx').on(table.empresaId),
  };
});
