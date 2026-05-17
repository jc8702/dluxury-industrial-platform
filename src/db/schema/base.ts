import { uuid, timestamp, integer } from 'drizzle-orm/pg-core';

export const timestamps = {
  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { mode: 'date' }).defaultNow().notNull(),
  deletedAt: timestamp('deleted_at', { mode: 'date' }),
};

export const auditable = {
  createdBy: uuid('created_by'),
  updatedBy: uuid('updated_by'),
};

export const versionable = {
  version: integer('versao').default(1).notNull(),
};

export const enterpriseColumns = {
  ...timestamps,
  ...auditable,
  ...versionable,
};
