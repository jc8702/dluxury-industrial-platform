'use client';

import { useAppStore } from '@/stores/app-store';
import { Search, Bell, ChevronRight } from 'lucide-react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

const ROUTE_LABELS: Record<string, string> = {
  dashboard: 'Dashboard',
  engenharia: 'Engenharia & BOM',
  producao: 'Produção (CNC)',
  comercial: 'Comercial & Vendas',
  projetos: 'Projetos',
  clientes: 'Clientes',
  configuracoes: 'Configurações',
  auth: 'Autenticação',
  login: 'Entrar',
};

export function Topbar() {
  const { sidebarOpen, toggleCommandPalette } = useAppStore();
  const pathname = usePathname() || '';

  // Gerar Breadcrumbs Dinâmicos
  const segments = pathname.split('/').filter(Boolean);
  const breadcrumbs = segments.map((segment, index) => {
    const href = '/' + segments.slice(0, index + 1).join('/');
    const isLast = index === segments.length - 1;
    
    // Tratamento de UUID ou ID dinâmico
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(segment);
    const label = ROUTE_LABELS[segment] || (isUuid ? 'Detalhes' : segment.charAt(0).toUpperCase() + segment.slice(1));

    return { label, href, isLast };
  });

  return (
    <header className={`fixed top-0 right-0 z-30 h-16 bg-[#1A1D24]/80 backdrop-blur-md border-b border-slate-800 transition-all duration-300 flex items-center justify-between px-6 ${sidebarOpen ? 'w-[calc(100%-16rem)]' : 'w-[calc(100%-5rem)]'}`}>
      
      {/* Breadcrumbs Dinâmicos */}
      <div className="flex items-center text-sm text-slate-400">
        <Link href="/dashboard" className="hover:text-white transition-colors">
          MarcenAI
        </Link>
        {breadcrumbs.length > 0 && <ChevronRight className="w-4 h-4 mx-2 text-slate-600 shrink-0" />}
        
        {breadcrumbs.map((crumb, idx) => (
          <div key={crumb.href} className="flex items-center">
            {crumb.isLast ? (
              <span className="text-white font-medium truncate max-w-[120px] sm:max-w-none">{crumb.label}</span>
            ) : (
              <Link href={crumb.href} className="hover:text-white transition-colors truncate max-w-[100px] sm:max-w-none">
                {crumb.label}
              </Link>
            )}
            {idx < breadcrumbs.length - 1 && (
              <ChevronRight className="w-4 h-4 mx-2 text-slate-600 shrink-0" />
            )}
          </div>
        ))}
      </div>

      {/* Right Actions */}
      <div className="flex items-center space-x-4">
        {/* Command Search Trigger */}
        <button 
          onClick={toggleCommandPalette}
          className="flex items-center px-3 py-1.5 bg-slate-800/50 border border-slate-700 rounded-md text-slate-400 hover:text-white transition-colors text-sm"
        >
          <Search className="w-4 h-4 mr-2" />
          <span className="hidden sm:inline">Pesquisar (Cmd+K)</span>
          <span className="sm:hidden">Pesquisar</span>
        </button>

        {/* Notifications */}
        <button className="relative p-2 text-slate-400 hover:text-white transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>

        {/* Profile Dropdown Placeholder */}
        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-500 to-emerald-400 border border-slate-700 cursor-pointer"></div>
      </div>

    </header>
  );
}

