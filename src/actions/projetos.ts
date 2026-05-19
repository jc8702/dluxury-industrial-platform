'use server';

import { db } from '@/db';
import { projetos } from '@/db/schema/projetos';
import { clientes } from '@/db/schema/clientes';
import { eq, and, ilike, or } from 'drizzle-orm';
import { auth } from '@/auth';
import { revalidatePath } from 'next/cache';

export async function getProjetos(searchTerm?: string) {
  const session = await auth();
  if (!session?.user?.empresaId) {
    return [];
  }

  const empresaId = session.user.empresaId;

  try {
    let queryResult;
    if (searchTerm) {
      queryResult = await db
        .select({
          id: projetos.id,
          nome: projetos.nome,
          clienteId: projetos.clienteId,
          clienteNome: clientes.nome,
          status: projetos.status,
          valorTotal: projetos.valorTotal,
          dataEntrega: projetos.dataEntrega,
          notas: projetos.notas,
          criadoEm: projetos.createdAt,
        })
        .from(projetos)
        .innerJoin(clientes, eq(projetos.clienteId, clientes.id))
        .where(
          and(
            eq(projetos.empresaId, empresaId),
            or(
              ilike(projetos.nome, `%${searchTerm}%`),
              ilike(clientes.nome, `%${searchTerm}%`)
            )
          )
        );
    } else {
      queryResult = await db
        .select({
          id: projetos.id,
          nome: projetos.nome,
          clienteId: projetos.clienteId,
          clienteNome: clientes.nome,
          status: projetos.status,
          valorTotal: projetos.valorTotal,
          dataEntrega: projetos.dataEntrega,
          notas: projetos.notas,
          criadoEm: projetos.createdAt,
        })
        .from(projetos)
        .innerJoin(clientes, eq(projetos.clienteId, clientes.id))
        .where(eq(projetos.empresaId, empresaId));
    }

    return queryResult;
  } catch (error) {
    console.error('Erro ao buscar projetos no Neon:', error);
    return [];
  }
}

export async function createProjeto(dados: {
  nome: string;
  clienteId: string;
  status?: string;
  valorTotal?: number;
  dataEntrega?: Date;
  notas?: string;
}) {
  const session = await auth();
  if (!session?.user?.empresaId) {
    return { success: false, error: 'Sessão expirada. Faça login novamente.' };
  }

  const empresaId = session.user.empresaId;

  try {
    const [novoProjeto] = await db
      .insert(projetos)
      .values({
        empresaId,
        clienteId: dados.clienteId,
        nome: dados.nome,
        status: dados.status || 'orcamento',
        valorTotal: dados.valorTotal ? dados.valorTotal.toString() : null,
        dataEntrega: dados.dataEntrega || null,
        notas: dados.notas || null,
      })
      .returning();

    revalidatePath('/projetos');
    return { success: true, data: novoProjeto };
  } catch (error: any) {
    console.error('Erro ao criar projeto no Neon:', error);
    return { success: false, error: 'Erro ao criar projeto. Verifique se o cliente selecionado é válido e tente novamente.' };
  }
}
