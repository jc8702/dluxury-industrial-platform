'use server';

import { db } from '@/db';
import { empresas } from '@/db/schema/empresas';
import { eq } from 'drizzle-orm';
import { auth } from '@/auth';
import { revalidatePath } from 'next/cache';

export async function getEmpresaConfig() {
  const session = await auth();
  if (!session?.user?.empresaId) return null;

  const empresaId = session.user.empresaId;

  try {
    const [empresa] = await db
      .select()
      .from(empresas)
      .where(eq(empresas.id, empresaId));
    
    return empresa || null;
  } catch (error) {
    console.error('Erro ao buscar configurações da empresa:', error);
    return null;
  }
}

export async function updateEmpresaConfig(dados: {
  razaoSocial?: string;
  cnpj?: string;
}) {
  const session = await auth();
  if (!session?.user?.empresaId) {
    return { success: false, error: 'Sessão expirada. Faça login novamente.' };
  }

  const empresaId = session.user.empresaId;

  try {
    const updates: any = {};
    if (dados.razaoSocial) updates.razaoSocial = dados.razaoSocial;
    if (dados.cnpj) updates.cnpj = dados.cnpj;
    
    updates.updatedAt = new Date();

    if (Object.keys(updates).length === 0) {
       return { success: true, message: 'Nenhuma alteração enviada.' };
    }

    await db
      .update(empresas)
      .set(updates)
      .where(eq(empresas.id, empresaId));

    revalidatePath('/configuracoes');
    return { success: true };
  } catch (error: any) {
    console.error('Erro ao atualizar empresa:', error);
    return { success: false, error: 'Erro ao salvar configurações. Verifique os dados.' };
  }
}
