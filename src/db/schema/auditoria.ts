import { pgTable, uuid, varchar, text, jsonb, index, timestamp } from 'drizzle-orm/pg-core';

export const auditoria = pgTable('auditoria', {
  id: uuid('id').primaryKey().defaultRandom(),
  tabela: varchar('tabela', { length: 100 }).notNull(),
  registroId: uuid('registro_id').notNull(),
  acao: varchar('acao', { length: 50 }).notNull(), // insert, update, delete
  dadosAntigos: jsonb('dados_antigos'),
  dadosNovos: jsonb('dados_novos'),
  usuarioId: uuid('usuario_id'), // User that triggered the action
  data: timestamp('data', { mode: 'date' }).defaultNow().notNull(),
  ipAddress: varchar('ip_address', { length: 45 }),
  userAgent: text('user_agent'),
}, (table) => {
  return {
    tabelaIdx: index('auditoria_tabela_idx').on(table.tabela),
    registroIdx: index('auditoria_registro_id_idx').on(table.registroId),
  };
});
