import { eq, sql } from 'drizzle-orm';
import { db } from '@/db';
import { PgTable } from 'drizzle-orm/pg-core';

/**
 * Enterprise Data Isolation (Row-Level Security / Drizzle Multi-Tenant)
 * 
 * Este helper garante que qualquer consulta passe obrigatoriamente
 * pelo filtro do Tenant ID, prevenindo vazamentos Cross-Tenant se o desenvolvedor esquecer o .where()
 */
export function withTenant<T extends PgTable>(table: T, tenantId: string) {
  // O Drizzle ainda não tem RLS nativo transparente sem PgBouncer, 
  // então forçamos a injeção do WHERE dinamicamente.
  return {
    // @ts-ignore
    query: db.select().from(table).where(eq((table as any).empresaId, tenantId)),
    update: (values: any) => db.update(table).set(values).where(eq((table as any).empresaId, tenantId)),
    delete: db.delete(table).where(eq((table as any).empresaId, tenantId)),
  };
}

/**
 * Utilitário de Policy RLS (Para execuções cruas caso configurado no DB)
 */
export async function setPostgresTenantContext(tenantId: string) {
  // Para arquiteturas que usam RLS puro no PostgreSQL:
  await db.execute(sql`set local app.current_tenant = ${tenantId}`);
}
