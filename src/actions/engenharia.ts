'use server';

import { db } from '@/db';
import { materiais } from '@/db/schema/materiais';
import { eq, and, ilike, or, count } from 'drizzle-orm';
import { auth } from '@/auth';
import { revalidatePath } from 'next/cache';

export async function getMateriais(searchTerm?: string) {
  const session = await auth();
  if (!session?.user?.empresaId) return [];

  const empresaId = session.user.empresaId;

  try {
    if (searchTerm) {
      return await db
        .select()
        .from(materiais)
        .where(
          and(
            eq(materiais.empresaId, empresaId),
            or(
              ilike(materiais.nome, `%${searchTerm}%`),
              ilike(materiais.tipo, `%${searchTerm}%`)
            )
          )
        );
    }

    return await db
      .select()
      .from(materiais)
      .where(eq(materiais.empresaId, empresaId));
  } catch (error) {
    console.error('Erro ao buscar materiais no Neon:', error);
    return [];
  }
}

export async function createMaterial(dados: {
  nome: string;
  tipo: string;
  espessura?: number;
  precoM2?: number;
  temVeio?: boolean;
}) {
  const session = await auth();
  if (!session?.user?.empresaId) {
    return { success: false, error: 'Sessão expirada. Faça login novamente.' };
  }

  const empresaId = session.user.empresaId;

  try {
    const [novoMaterial] = await db
      .insert(materiais)
      .values({
        empresaId,
        nome: dados.nome,
        tipo: dados.tipo,
        espessura: dados.espessura ? dados.espessura.toString() : null,
        precoM2: dados.precoM2 ? dados.precoM2.toString() : null,
        temVeio: dados.temVeio || false,
      })
      .returning();

    revalidatePath('/engenharia');
    return { success: true, data: novoMaterial };
  } catch (error: any) {
    console.error('Erro ao criar material no Neon:', error);
    return { success: false, error: 'Erro ao salvar insumo. Verifique os dados e tente novamente.' };
  }
}

export async function getMateriaisCount() {
  const session = await auth();
  if (!session?.user?.empresaId) return 0;

  try {
    const [result] = await db
      .select({ total: count() })
      .from(materiais)
      .where(eq(materiais.empresaId, session.user.empresaId));
    return result?.total || 0;
  } catch {
    return 0;
  }
}
