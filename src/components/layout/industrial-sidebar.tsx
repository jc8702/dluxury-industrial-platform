'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Wrench, FileCheck2, Settings, ChevronLeft, ChevronRight, DollarSign, FolderOpen, Users, Cuboid, Cpu } from 'lucide-react';
import { useAppStore } from '@/stores/app-store';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function IndustrialSidebar() {
  const pathname = usePathname();
  const { sidebarOpen, toggleSidebar } = useAppStore();

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Engenharia & BOM', href: '/engenharia', icon: FileCheck2 },
    { name: 'Produção (CNC)', href: '/producao', icon: Wrench },
    { name: 'Comercial & Vendas', href: '/comercial', icon: DollarSign },
    { name: 'Projetos', href: '/projetos', icon: FolderOpen },
    { name: 'Clientes', href: '/clientes', icon: Users },
    { name: 'Assistente IA', href: '/assistente', icon: Cpu },
    { name: 'Configurações', href: '/configuracoes', icon: Settings },
  ];

  return (
    <aside className={cn(
      "fixed top-0 left-0 z-40 h-screen transition-all duration-300 bg-[#0F1115] border-r border-slate-800 flex flex-col",
      sidebarOpen ? "w-64" : "w-20"
    )}>
      {/* Brand Header */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-slate-800">
        {sidebarOpen ? (
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 rounded-md flex items-center justify-center">
              <Cuboid className="w-5 h-5 text-white" />
            </div>
            <span className="text-white font-bold tracking-tight text-xl">Marcen<span className="text-blue-500">AI</span></span>
          </div>
        ) : (
          <div className="w-12 h-10 bg-blue-600 rounded-md flex items-center justify-center mx-auto">
            <Cuboid className="w-6 h-6 text-white" />
          </div>
        )}
      </div>

      {/* Navigation Links */}
      <div className="flex-1 overflow-y-auto py-6 px-3 space-y-1">
        {navigation.map((item) => {
          const isActive = pathname.startsWith(item.href);
          return (
            <Link key={item.name} href={item.href} className={cn(
              "flex items-center px-3 py-3 rounded-lg transition-colors group",
              isActive ? "bg-slate-800 text-white" : "text-slate-400 hover:bg-slate-800/50 hover:text-white"
            )}>
              <item.icon className={cn("flex-shrink-0 w-5 h-5", isActive ? "text-blue-400" : "text-slate-500 group-hover:text-blue-400")} />
              {sidebarOpen && <span className="ml-3 text-sm font-medium">{item.name}</span>}
            </Link>
          );
        })}
      </div>

      {/* Toggle Button */}
      <div className="p-4 border-t border-slate-800 flex justify-end">
        <button onClick={toggleSidebar} className="p-2 bg-slate-800 rounded-md text-slate-400 hover:text-white transition-colors">
          {sidebarOpen ? <ChevronLeft className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
        </button>
      </div>
    </aside>
  );
}
