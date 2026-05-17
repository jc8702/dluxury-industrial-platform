import { ExecutiveDashboard } from '@/components/dashboard/ExecutiveDashboard';

export default function DashboardPage() {
  // Num cenário real, o auth() forneceria o Tenant e Role
  const mockTenant = '7e7811d7-bfd3-4fc6-b250-9ce068d374ce';
  const mockRole = 'admin';

  return <ExecutiveDashboard empresaId={mockTenant} userRole={mockRole} />;
}
