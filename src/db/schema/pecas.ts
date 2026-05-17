import { pgTable, uuid, varchar, decimal, index, boolean } from 'drizzle-orm/pg-core';
import { moveis } from './moveis';
import { materiais } from './materiais';
import { enterpriseColumns } from './base';

export const pecas = pgTable('pecas', {
  id: uuid('id').primaryKey().defaultRandom(),
  movelId: uuid('movel_id').notNull().references(() => moveis.id, { onDelete: 'cascade' }),
  materialId: uuid('material_id').notNull().references(() => materiais.id, { onDelete: 'restrict' }),
  nome: varchar('nome', { length: 255 }).notNull(), // Lateral Dir, Base, Prateleira
  comprimento: decimal('comprimento', { precision: 8, scale: 2 }).notNull(), // em mm
  largura: decimal('largura', { precision: 8, scale: 2 }).notNull(), // em mm
  espessura: decimal('espessura', { precision: 5, scale: 2 }).notNull(), // em mm
  quantidade: decimal('quantidade', { precision: 5, scale: 0 }).default('1').notNull(),
  orientacaoVeio: boolean('orientacao_veio').default(true), // true = acompanha o comprimento
  
  // Fita de borda (relacionamento com material tipo fita ou boolean se for fita padrão do móvel)
  fitaTopoId: uuid('fita_topo_id').references(() => materiais.id, { onDelete: 'set null' }),
  fitaBaseId: uuid('fita_base_id').references(() => materiais.id, { onDelete: 'set null' }),
  fitaEsqId: uuid('fita_esq_id').references(() => materiais.id, { onDelete: 'set null' }),
  fitaDirId: uuid('fita_dir_id').references(() => materiais.id, { onDelete: 'set null' }),
  
  // Maquinação (CNC)
  programaCnc: varchar('programa_cnc', { length: 255 }), // Referência ao programa gcode gerado
  
  ...enterpriseColumns,
}, (table) => {
  return {
    movelIdx: index('pecas_movel_id_idx').on(table.movelId),
    materialIdx: index('pecas_material_id_idx').on(table.materialId),
  };
});
