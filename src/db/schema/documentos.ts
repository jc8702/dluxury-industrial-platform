import { pgTable, uuid, varchar, text, integer, index } from 'drizzle-orm/pg-core';
import { empresas } from './empresas';
import { enterpriseColumns } from './base';

export const documentosTecnicos = pgTable('documentos_tecnicos', {
  id: uuid('id').primaryKey().defaultRandom(),
  empresaId: uuid('empresa_id').notNull().references(() => empresas.id, { onDelete: 'cascade' }),
  
  nomeArquivo: varchar('nome_arquivo', { length: 500 }).notNull(),
  url: text('url').notNull(),
  provider: varchar('provider', { length: 50 }).notNull(), // 'cloudflare_r2', 'uploadthing'
  chaveStorage: varchar('chave_storage', { length: 500 }).notNull(), // File key for retrieval/deletion
  
  extensao: varchar('extensao', { length: 20 }).notNull(), // pdf, dxf, step, png, etc
  mimeType: varchar('mime_type', { length: 100 }),
  tamanhoBytes: integer('tamanho_bytes'),
  
  versao: integer('versao').default(1).notNull(),
  versaoAnteriorId: uuid('versao_anterior_id'), // Self-reference for version tracking
  
  categoria: varchar('categoria', { length: 100 }).notNull(), // manual, engenharia, cnc_dxf, 3d_step
  statusIndexacao: varchar('status_indexacao', { length: 50 }).default('pendente'), // pendente, ocr_concluido, vetorizado, erro
  
  ...enterpriseColumns,
}, (table) => {
  return {
    empresaIdx: index('documentos_tecnicos_empresa_idx').on(table.empresaId),
    categoriaIdx: index('documentos_tecnicos_categoria_idx').on(table.categoria),
    statusIdx: index('documentos_tecnicos_status_idx').on(table.statusIndexacao),
  };
});
