'use server';

import { db } from '@/db';
import { clientes } from '@/db/schema/clientes';
import { eq, and, ilike, or } from 'drizzle-orm';
import { auth } from '@/auth';
import { revalidatePath } from 'next/cache';

export async function getClientes(searchTerm?: string) {
  const session = await auth();
  if (!session?.user?.empresaId) {
    return [];
  }

  const empresaId = session.user.empresaId;

  try {
    if (searchTerm) {
      return await db
        .select()
        .from(clientes)
        .where(
          and(
            eq(clientes.empresaId, empresaId),
            or(
              ilike(clientes.nome, `%${searchTerm}%`),
              ilike(clientes.email, `%${searchTerm}%`),
              ilike(clientes.documento, `%${searchTerm}%`)
            )
          )
        );
    }

    return await db
      .select()
      .from(clientes)
      .where(eq(clientes.empresaId, empresaId));
  } catch (error) {
    console.error('Erro ao buscar clientes no Neon:', error);
    return [];
  }
}

export async function createCliente(dados: {
  nome: string;
  documento?: string;
  email?: string;
  telefone?: string;
  endereco?: string;
}) {
  const session = await auth();
  if (!session?.user?.empresaId) {
    return { success: false, error: 'Sessão expirada. Faça login novamente.' };
  }

  const empresaId = session.user.empresaId;

  try {
    const [novoCliente] = await db
      .insert(clientes)
      .values({
        empresaId,
        nome: dados.nome,
        documento: dados.documento || null,
        email: dados.email || null,
        telefone: dados.telefone || null,
        endereco: dados.endereco || null,
      })
      .returning();

    revalidatePath('/clientes');
    return { success: true, data: novoCliente };
  } catch (error: any) {
    console.error('Erro ao criar cliente no Neon:', error);
    // NUNCA expor SQL raw ao usuário
    return { success: false, error: 'Erro ao salvar cliente. Verifique se sua sessão está ativa e tente novamente.' };
  }
}
