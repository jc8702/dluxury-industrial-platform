import { pgTable, uuid, varchar, decimal, index, boolean } from 'drizzle-orm/pg-core';
import { empresas } from './empresas';
import { enterpriseColumns } from './base';

export const materiais = pgTable('materiais', {
  id: uuid('id').primaryKey().defaultRandom(),
  empresaId: uuid('empresa_id').notNull().references(() => empresas.id, { onDelete: 'cascade' }),
  nome: varchar('nome', { length: 255 }).notNull(), // MDF Branco TX, Fita de Borda Branca, etc.
  tipo: varchar('tipo', { length: 50 }).notNull(), // chapa, fita, fundo
  espessura: decimal('espessura', { precision: 5, scale: 2 }), // 15, 18, 6, 0.45
  precoM2: decimal('preco_m2', { precision: 10, scale: 2 }), // Preço base para cálculo
  temVeio: boolean('tem_veio').default(false).notNull(), // Importante para otimização de plano de corte
  ...enterpriseColumns,
}, (table) => {
  return {
    empresaIdx: index('materiais_empresa_id_idx').on(table.empresaId),
  };
});
