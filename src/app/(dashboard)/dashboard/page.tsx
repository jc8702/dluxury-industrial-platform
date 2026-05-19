import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { ExecutiveDashboard } from '@/components/dashboard/ExecutiveDashboard';

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user?.empresaId) {
    redirect('/auth/login');
  }

  return (
    <ExecutiveDashboard
      empresaId={session.user.empresaId}
      userRole={session.user.role || 'user'}
    />
  );
}
