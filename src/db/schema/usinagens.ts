import { pgTable, uuid, varchar, numeric, index } from 'drizzle-orm/pg-core';
import { empresas } from './empresas';
import { pecas } from './pecas';
import { enterpriseColumns } from './base';

/**
 * Tabela explícita para Operações de Usinagem CNC de cada Peça
 * Gerada pela Engine Paramétrica para posterior exportação de GCODE/XML (Promob/Maestro/WoodWOP).
 */
export const usinagens = pgTable('usinagens', {
  id: uuid('id').primaryKey().defaultRandom(),
  empresaId: uuid('empresa_id').notNull().references(() => empresas.id, { onDelete: 'cascade' }),
  pecaId: uuid('peca_id').notNull().references(() => pecas.id, { onDelete: 'cascade' }),
  
  // Tipo da usinagem
  tipoOperacao: varchar('tipo_operacao', { length: 50 }).notNull(), // 'furo', 'rasgo', 'rebaixo', 'corte_angulo'
  face: varchar('face', { length: 20 }).notNull(), // 'topo', 'base', 'esquerda', 'direita', 'frente', 'fundo'
  
  // Coordenadas absolutas na peça
  x: numeric('x', { precision: 10, scale: 2 }).notNull(),
  y: numeric('y', { precision: 10, scale: 2 }).notNull(),
  z: numeric('z', { precision: 10, scale: 2 }).notNull(),
  
  // Parâmetros da Ferramenta
  diametroBroca: numeric('diametro_broca', { precision: 5, scale: 2 }), // Ex: 5.0 (Minifix), 35.0 (Dobradiça)
  profundidade: numeric('profundidade', { precision: 10, scale: 2 }).notNull(),
  
  // Para rasgos (Grooves)
  comprimentoX: numeric('comprimento_x', { precision: 10, scale: 2 }),
  comprimentoY: numeric('comprimento_y', { precision: 10, scale: 2 }),
  
  ...enterpriseColumns,
}, (table) => {
  return {
    empresaIdx: index('usinagens_empresa_idx').on(table.empresaId),
    pecaIdx: index('usinagens_peca_idx').on(table.pecaId),
    tipoOperacaoIdx: index('usinagens_tipo_idx').on(table.tipoOperacao),
  };
});
