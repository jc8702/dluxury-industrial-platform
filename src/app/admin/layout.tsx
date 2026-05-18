import React from 'react';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Shield, LayoutDashboard, Building2, Terminal, LogOut, Lock } from 'lucide-react';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  // 1. Obter e validar a sessão no servidor com NextAuth v5
  const session = await auth();

  // 2. Bloqueio estrito se o usuário não for 'superadmin'
  if (!session || session.user.role !== 'superadmin') {
    redirect('/admin/unauthorized');
  }

  return (
    <div className="min-h-screen bg-[#090B0F] text-slate-100 flex font-sans">
      {/* Sidebar de Administração Global Brutalista Ciano */}
      <aside className="w-64 bg-[#0D1016] border-r border-cyan-500/20 flex flex-col shrink-0 relative">
        {/* Efeito luminoso neon sutil no topo da sidebar */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-500 to-transparent" />

        {/* Branding e Header da Sidebar */}
        <div className="p-6 border-b border-slate-900 flex items-center space-x-3 bg-[#11151E]/40">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center border border-cyan-400/20 shadow-lg shadow-cyan-500/10">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-xs font-black tracking-widest text-white uppercase font-mono">
              MARCENAI SAAS
            </h1>
            <p className="text-[9px] text-cyan-400 font-extrabold tracking-wider font-mono">
              SUPERADMIN PORTAL
            </p>
          </div>
        </div>

        {/* Menu de Navegação Administrativa */}
        <nav className="flex-1 px-4 py-6 space-y-2">
          <Link
            href="/admin"
            className="flex items-center space-x-3 px-3 py-2.5 rounded-lg text-xs font-bold text-slate-400 hover:text-white hover:bg-slate-900 border border-transparent hover:border-cyan-500/10 transition-all font-mono group"
          >
            <LayoutDashboard className="w-4 h-4 group-hover:text-cyan-400 transition-colors" />
            <span>Métricas Globais</span>
          </Link>

          <Link
            href="/admin/empresas"
            className="flex items-center space-x-3 px-3 py-2.5 rounded-lg text-xs font-bold text-slate-400 hover:text-white hover:bg-slate-900 border border-transparent hover:border-cyan-500/10 transition-all font-mono group"
          >
            <Building2 className="w-4 h-4 group-hover:text-cyan-400 transition-colors" />
            <span>Gerenciar Tenants</span>
          </Link>

          <Link
            href="/admin/auditoria"
            className="flex items-center space-x-3 px-3 py-2.5 rounded-lg text-xs font-bold text-slate-400 hover:text-white hover:bg-slate-900 border border-transparent hover:border-cyan-500/10 transition-all font-mono group"
          >
            <Terminal className="w-4 h-4 group-hover:text-cyan-400 transition-colors" />
            <span>Logs de Auditoria</span>
          </Link>
        </nav>

        {/* Rodapé da Sidebar - Dados do Usuário Logado */}
        <div className="p-4 border-t border-slate-900 bg-[#11151E]/20">
          <div className="flex items-center space-x-3 mb-3">
            <div className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center font-mono text-xs font-bold text-cyan-400">
              SA
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[10px] font-extrabold text-white truncate font-mono uppercase">
                {session.user.name || 'Super Admin'}
              </p>
              <p className="text-[8px] text-cyan-500 truncate font-mono font-semibold">
                PLATFORM CONTROLLER
              </p>
            </div>
          </div>

          <Link
            href="/dashboard"
            className="flex items-center justify-center space-x-2 w-full py-2 bg-slate-950 hover:bg-slate-900 border border-slate-900 hover:border-slate-800 text-[10px] font-bold text-slate-400 hover:text-white rounded-lg transition-all font-mono cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Voltar ao App</span>
          </Link>
        </div>
      </aside>

      {/* Conteúdo Principal Administrativo */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Header superior */}
        <header className="h-16 border-b border-slate-900/60 bg-[#0D1016]/40 backdrop-blur-md px-8 flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-2 text-xs font-semibold text-slate-500 font-mono">
            <span>PLATFORM</span>
            <span>/</span>
            <span className="text-cyan-400">ADMIN CONTROL CORE</span>
          </div>

          <div className="flex items-center space-x-4">
            <div className="px-2.5 py-1 bg-cyan-950/20 border border-cyan-500/20 text-cyan-400 font-mono text-[9px] font-extrabold rounded-md uppercase tracking-wider flex items-center gap-1.5 shadow-sm">
              <Lock className="w-3 h-3" />
              <span>SECURE ACCESS ONLY</span>
            </div>
          </div>
        </header>

        {/* Área útil */}
        <div className="flex-1 p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
