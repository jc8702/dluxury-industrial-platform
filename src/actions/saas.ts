'use server';

import { db } from '@/db';
import { usoRecursos } from '@/db/schema/saas';
import { empresas } from '@/db/schema/empresas';
import { usuarios } from '@/db/schema/usuarios';
import { logSecurityEvent } from '@/lib/auth/security-logs';
import { v4 as uuidv4 } from 'uuid';
import { format, addDays } from 'date-fns';

interface OnboardingPayload {
  razaoSocial: string;
  cnpj: string;
  adminNome: string;
  adminEmail: string;
}

/**
 * Criação Enterprise de Workspace (Multi-Tenant Onboarding)
 */
export async function provisionNewTenant(payload: OnboardingPayload) {
  try {
    return await db.transaction(async (tx) => {
      // 1. Cria a Empresa (Tenant) com Trial de 14 dias
      const [novaEmpresa] = await tx.insert(empresas).values({
        nome: payload.razaoSocial.split(' ')[0],
        razaoSocial: payload.razaoSocial,
        cnpj: payload.cnpj,
        plano: 'pro',
        statusAssinatura: 'trialing',
        trialFim: addDays(new Date(), 14).toISOString(),
      }).returning();

      // 2. Cria o Usuário Admin Fundador
      const [novoAdmin] = await tx.insert(usuarios).values({
        empresaId: novaEmpresa.id,
        nome: payload.adminNome,
        email: payload.adminEmail,
        senhaHash: '$2a$10$temporaryhashforonboardingunusableuntilresetpwd',
        role: 'admin',
        ativo: true,
      }).returning();

      // 3. Inicializa Painel de Faturamento / Consumo do Mês Vigente
      await tx.insert(usoRecursos).values({
        empresaId: novaEmpresa.id,
        periodo: format(new Date(), 'yyyy-MM'),
        usuariosAtivos: 1,
      });

      // 4. Dispara Auditoria e Onboarding Tracking
      await logSecurityEvent({
        tabela: 'empresas',
        acao: 'tenant_provisioned',
        usuarioId: novoAdmin.id,
        dadosNovos: { empresaId: novaEmpresa.id, plano: 'pro' },
      });

      // 5. Integração Assíncrona com Stripe (Billing) e Mixpanel (Analytics)
      // await createStripeCustomer(novaEmpresa.id, payload.adminEmail);

      return { success: true, empresaId: novaEmpresa.id, userId: novoAdmin.id };
    });
  } catch (error: any) {
    console.error('Falha no provisionamento do Tenant:', error);
    return { success: false, error: 'Não foi possível aprovar a conta. CNPJ pode já estar em uso.' };
  }
}
