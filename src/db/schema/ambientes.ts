import { pgTable, uuid, varchar, index } from 'drizzle-orm/pg-core';
import { projetos } from './projetos';
import { enterpriseColumns } from './base';

export const ambientes = pgTable('ambientes', {
  id: uuid('id').primaryKey().defaultRandom(),
  projetoId: uuid('projeto_id').notNull().references(() => projetos.id, { onDelete: 'cascade' }),
  nome: varchar('nome', { length: 255 }).notNull(), // Cozinha, Quarto 1, Sala, etc.
  tipo: varchar('tipo', { length: 100 }), 
  ...enterpriseColumns,
}, (table) => {
  return {
    projetoIdx: index('ambientes_projeto_id_idx').on(table.projetoId),
  };
});
