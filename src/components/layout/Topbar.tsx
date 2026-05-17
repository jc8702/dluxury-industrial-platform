'use client';

import { useAppStore } from '@/stores/app-store';
import { Search, Bell, ChevronRight } from 'lucide-react';

export function Topbar() {
  const { sidebarOpen, toggleCommandPalette } = useAppStore();

  return (
    <header className={`fixed top-0 right-0 z-30 h-16 bg-[#1A1D24]/80 backdrop-blur-md border-b border-slate-800 transition-all duration-300 flex items-center justify-between px-6 ${sidebarOpen ? 'w-[calc(100%-16rem)]' : 'w-[calc(100%-5rem)]'}`}>
      
      {/* Breadcrumbs */}
      <div className="flex items-center text-sm text-slate-400">
        <span className="hover:text-white cursor-pointer transition-colors">Dashboard</span>
        <ChevronRight className="w-4 h-4 mx-2 text-slate-600" />
        <span className="text-white font-medium">Visão Geral</span>
      </div>

      {/* Right Actions */}
      <div className="flex items-center space-x-4">
        {/* Command Search Trigger */}
        <button 
          onClick={toggleCommandPalette}
          className="flex items-center px-3 py-1.5 bg-slate-800/50 border border-slate-700 rounded-md text-slate-400 hover:text-white transition-colors text-sm"
        >
          <Search className="w-4 h-4 mr-2" />
          <span>Pesquisar (Cmd+K)</span>
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
