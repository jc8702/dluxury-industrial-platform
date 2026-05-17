import { pgTable, uuid, varchar, text, boolean, timestamp, index, uniqueIndex } from 'drizzle-orm/pg-core';
import { empresas } from './empresas';
import { enterpriseColumns } from './base';

export const usuarios = pgTable('usuarios', {
  id: uuid('id').primaryKey().defaultRandom(),
  empresaId: uuid('empresa_id').notNull().references(() => empresas.id, { onDelete: 'cascade' }),
  nome: varchar('nome', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).notNull(),
  senhaHash: text('senha_hash').notNull(),
  role: varchar('role', { length: 50 }).default('user').notNull(),
  ativo: boolean('ativo').default(true).notNull(),
  emailVerified: timestamp('emailVerified', { mode: 'date' }),
  image: varchar('image', { length: 255 }),
  ...enterpriseColumns,
}, (table) => {
  return {
    empresaIdx: index('usuarios_empresa_id_idx').on(table.empresaId),
    emailIdx: uniqueIndex('usuarios_email_idx').on(table.email),
  };
});
