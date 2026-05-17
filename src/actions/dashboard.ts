'use server';

import { getExecutiveMetrics } from '@/lib/dashboard/metrics';
import { requirePermission } from '@/lib/auth/roles';

export async function fetchDashboardData(empresaId: string, userRole: string, forceRefresh = false) {
  // Controle de Auditoria (Apenas Admin/Comercial/Engenharia podem ver KPIs)
  if (userRole !== 'admin' && userRole !== 'comercial' && userRole !== 'engenharia') {
    throw new Error('Acesso Negado aos KPIs Executivos');
  }

  // Busca dados passando pelo Redis Cache
  return await getExecutiveMetrics(empresaId, forceRefresh);
}
