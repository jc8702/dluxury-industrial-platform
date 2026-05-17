import { pgTable, uuid, varchar, decimal, index, jsonb } from 'drizzle-orm/pg-core';
import { ambientes } from './ambientes';
import { enterpriseColumns } from './base';

export const moveis = pgTable('moveis', {
  id: uuid('id').primaryKey().defaultRandom(),
  ambienteId: uuid('ambiente_id').notNull().references(() => ambientes.id, { onDelete: 'cascade' }),
  nome: varchar('nome', { length: 255 }).notNull(), // Armário Superior, Balcão, etc.
  tipo: varchar('tipo', { length: 100 }), // Modulo, Parametrico
  largura: decimal('largura', { precision: 8, scale: 2 }).notNull(), // em mm
  altura: decimal('altura', { precision: 8, scale: 2 }).notNull(), // em mm
  profundidade: decimal('profundidade', { precision: 8, scale: 2 }).notNull(), // em mm
  parametrosIniciais: jsonb('parametros_iniciais'), // Configuracoes construtivas iniciais
  ...enterpriseColumns,
}, (table) => {
  return {
    ambienteIdx: index('moveis_ambiente_id_idx').on(table.ambienteId),
  };
});
