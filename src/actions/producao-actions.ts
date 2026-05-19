'use server';

import { db } from '@/db';
import { producao } from '@/db/schema/producao';
import { projetos } from '@/db/schema/projetos';
import { clientes } from '@/db/schema/clientes';
import { eq, and } from 'drizzle-orm';
import { auth } from '@/auth';
import { revalidatePath } from 'next/cache';

export async function getOrdensProducao() {
  const session = await auth();
  if (!session?.user?.empresaId) return [];

  const empresaId = session.user.empresaId;

  try {
    return await db
      .select({
        id: producao.id,
        status: producao.status,
        dataInicio: producao.dataInicio,
        dataFim: producao.dataFim,
        projetoNome: projetos.nome,
        clienteNome: clientes.nome,
        criadoEm: producao.createdAt,
      })
      .from(producao)
      .innerJoin(projetos, eq(producao.projetoId, projetos.id))
      .innerJoin(clientes, eq(projetos.clienteId, clientes.id))
      .where(eq(producao.empresaId, empresaId));
  } catch (error) {
    console.error('Erro ao buscar ordens de produção:', error);
    return [];
  }
}

export async function createOrdemProducao(dados: {
  projetoId: string;
  status?: string;
}) {
  const session = await auth();
  if (!session?.user?.empresaId) {
    return { success: false, error: 'Sessão expirada. Faça login novamente.' };
  }

  try {
    const [novaOP] = await db
      .insert(producao)
      .values({
        empresaId: session.user.empresaId,
        projetoId: dados.projetoId,
        status: dados.status || 'aguardando',
      })
      .returning();

    revalidatePath('/producao');
    return { success: true, data: novaOP };
  } catch (error: any) {
    console.error('Erro ao criar OP:', error);
    return { success: false, error: 'Erro ao criar ordem de produção. Verifique se o projeto selecionado é válido.' };
  }
}

export async function updateStatusOP(opId: string, novoStatus: string) {
  const session = await auth();
  if (!session?.user?.empresaId) {
    return { success: false, error: 'Sessão expirada.' };
  }

  try {
    await db
      .update(producao)
      .set({ status: novoStatus, updatedAt: new Date() })
      .where(and(eq(producao.id, opId), eq(producao.empresaId, session.user.empresaId)));

    revalidatePath('/producao');
    return { success: true };
  } catch (error: any) {
    console.error('Erro ao atualizar OP:', error);
    return { success: false, error: 'Erro ao atualizar status da ordem de produção.' };
  }
}
