import { pgTable, uuid, varchar, text, boolean, uniqueIndex } from 'drizzle-orm/pg-core';
import { enterpriseColumns } from './base';

export const empresas = pgTable('empresas', {
  id: uuid('id').primaryKey().defaultRandom(),
  nome: varchar('nome', { length: 255 }).notNull(),
  razaoSocial: varchar('razao_social', { length: 255 }).notNull(),
  cnpj: varchar('cnpj', { length: 20 }).notNull().unique(),
  ativo: boolean('ativo').default(true).notNull(),
  plano: varchar('plano', { length: 50 }).default('starter').notNull(),
  stripeCustomerId: varchar('stripe_customer_id', { length: 255 }),
  stripeSubscriptionId: varchar('stripe_subscription_id', { length: 255 }),
  statusAssinatura: varchar('status_assinatura', { length: 50 }).default('trialing').notNull(),
  trialFim: text('trial_fim'), // Armazena data ISO
  ...enterpriseColumns,
}, (table) => {
  return {
    cnpjIdx: uniqueIndex('empresas_cnpj_idx').on(table.cnpj),
  };
});
