'use server';

import { db } from '@/db';
import { projetos } from '@/db/schema/projetos';
import { clientes } from '@/db/schema/clientes';
import { eq, and, sql } from 'drizzle-orm';
import { auth } from '@/auth';

export async function getProjetosPorStatus() {
  const session = await auth();
  if (!session?.user?.empresaId) return [];

  const empresaId = session.user.empresaId;

  try {
    return await db
      .select({
        id: projetos.id,
        nome: projetos.nome,
        clienteNome: clientes.nome,
        status: projetos.status,
        valorTotal: projetos.valorTotal,
        criadoEm: projetos.createdAt,
      })
      .from(projetos)
      .innerJoin(clientes, eq(projetos.clienteId, clientes.id))
      .where(eq(projetos.empresaId, empresaId));
  } catch (error) {
    console.error('Erro ao buscar dados comerciais:', error);
    return [];
  }
}

export async function getResumoComercial() {
  const session = await auth();
  if (!session?.user?.empresaId) return { totalProjetos: 0, valorTotal: 0, ticketMedio: 0 };

  const empresaId = session.user.empresaId;

  try {
    const result = await db
      .select({
        totalProjetos: sql<number>`count(*)`,
        valorTotal: sql<number>`coalesce(sum(${projetos.valorTotal}::numeric), 0)`,
      })
      .from(projetos)
      .where(eq(projetos.empresaId, empresaId));

    const total = Number(result[0]?.totalProjetos) || 0;
    const valor = Number(result[0]?.valorTotal) || 0;

    return {
      totalProjetos: total,
      valorTotal: valor,
      ticketMedio: total > 0 ? valor / total : 0,
    };
  } catch (error) {
    console.error('Erro ao buscar resumo comercial:', error);
    return { totalProjetos: 0, valorTotal: 0, ticketMedio: 0 };
  }
}
