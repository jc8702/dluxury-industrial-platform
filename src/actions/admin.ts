'use server';

import { db } from "@/db";
import { empresas } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";

/**
 * Validar se o usuário logado é de fato um SuperAdmin antes de executar qualquer ação
 */
async function validarSuperAdmin() {
  const session = await auth();
  if (!session || session.user.role !== 'superadmin') {
    throw new Error('Acesso negado. Ação administrativa restrita.');
  }
}

/**
 * Inverte o status ativo/bloqueado de uma empresa (Tenant)
 */
export async function toggleTenantStatus(tenantId: string, currentStatus: boolean) {
  try {
    await validarSuperAdmin();

    const novoStatus = !currentStatus;
    
    await db
      .update(empresas)
      .set({ ativo: novoStatus })
      .where(eq(empresas.id, tenantId));

    console.log(`[SuperAdmin] Empresa ${tenantId} teve o status alterado para ${novoStatus ? 'ATIVO' : 'BLOQUEADO'}`);
    
    revalidatePath('/admin/empresas');
    revalidatePath('/admin');
    
    return { success: true, active: novoStatus };
  } catch (error: any) {
    console.error('Erro ao alterar status da empresa:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Atualiza o plano de assinatura da empresa (Tenant)
 */
export async function updateTenantPlan(tenantId: string, newPlan: string) {
  try {
    await validarSuperAdmin();

    await db
      .update(empresas)
      .set({ plano: newPlan })
      .where(eq(empresas.id, tenantId));

    console.log(`[SuperAdmin] Empresa ${tenantId} teve o plano alterado para ${newPlan.toUpperCase()}`);

    revalidatePath('/admin/empresas');
    revalidatePath('/admin');

    return { success: true };
  } catch (error: any) {
    console.error('Erro ao alterar plano da empresa:', error);
    return { success: false, error: error.message };
  }
}
