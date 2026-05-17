import { pgTable, uuid, varchar, text, jsonb, index, uniqueIndex } from 'drizzle-orm/pg-core';
import { empresas } from './empresas';
import { projetos } from './projetos';
import { ambientes } from './ambientes';
import { enterpriseColumns } from './base';

/**
 * Tabela para armazenar os módulos brutos importados do SketchUp (Dynamic Components).
 * Serve como base antes da explosão para a tabela 'moveis' e 'pecas'.
 */
export const modulosSketchup = pgTable('modulos_sketchup', {
  id: uuid('id').primaryKey().defaultRandom(),
  empresaId: uuid('empresa_id').notNull().references(() => empresas.id, { onDelete: 'cascade' }),
  projetoId: uuid('projeto_id').notNull().references(() => projetos.id, { onDelete: 'cascade' }),
  ambienteId: uuid('ambiente_id').references(() => ambientes.id, { onDelete: 'set null' }),
  
  // Identificação do SketchUp
  guidSketchup: varchar('guid_sketchup', { length: 255 }).notNull(),
  nomeComponente: varchar('nome_componente', { length: 255 }).notNull(), // Ex: "Balcão Pia 2 Portas"
  
  // Geometria e Transformações 3D Base
  posicaoX: varchar('posicao_x', { length: 50 }),
  posicaoY: varchar('posicao_y', { length: 50 }),
  posicaoZ: varchar('posicao_z', { length: 50 }),
  
  dimensoesRaw: jsonb('dimensoes_raw'), // Largura, Altura, Profundidade bruta (JSON)
  atributosDinamicos: jsonb('atributos_dinamicos'), // Atributos lidos do DC (Dynamic Component)
  
  hashImportacao: varchar('hash_importacao', { length: 255 }).notNull(), // Para detectar se houve mudança no .skp e rodar o diff
  
  ...enterpriseColumns,
}, (table) => {
  return {
    empresaIdx: index('modulos_sketchup_empresa_idx').on(table.empresaId),
    projetoIdx: index('modulos_sketchup_projeto_idx').on(table.projetoId),
    // Garantir que a mesma peça do SketchUp não seja duplicada no mesmo projeto durante o sync
    guidProjetoIdx: uniqueIndex('modulos_sketchup_guid_projeto_idx').on(table.projetoId, table.guidSketchup),
  };
});
