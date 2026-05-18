'use client';

import { Suspense, useEffect, useState } from 'react';
import { IndustrialSidebar } from '@/components/layout/industrial-sidebar';
import { Topbar } from '@/components/layout/topbar';
import { CommandPalette } from '@/components/layout/command-palette';
import { useAppStore } from '@/stores/app-store';
import LoadingScreen from './loading';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { sidebarOpen, toggleSidebar, toggleCommandPalette } = useAppStore();
  const [mounted, setMounted] = useState(false);

  // Evitar incompatibilidades de hidratação do Zustand persistido
  useEffect(() => {
    setMounted(true);
  }, []);

  // Atalhos de teclado globais
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Toggle Command Palette: Ctrl+K / Cmd+K
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        toggleCommandPalette();
      }
      // Toggle Sidebar: Ctrl+B / Cmd+B
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'b') {
        e.preventDefault();
        toggleSidebar();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [toggleSidebar, toggleCommandPalette]);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-[#0F1115] flex">
        {/* Placeholder estático pré-hidratado para evitar layout shift */}
        <div className="fixed top-0 left-0 z-40 h-screen w-64 bg-[#0F1115] border-r border-slate-800" />
        <div className="flex-1 ml-64">
          <header className="fixed top-0 right-0 z-30 h-16 w-[calc(100%-16rem)] bg-[#1A1D24]/80 border-b border-slate-800" />
          <main className="mt-16 min-h-[calc(100vh-4rem)] bg-[#0F1115]" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0F1115] flex">
      <IndustrialSidebar />
      <CommandPalette />
      
      <div className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-20'}`}>
        <Topbar />
        
        {/* main content area */}
        <main className="mt-16 min-h-[calc(100vh-4rem)] relative">
          {/* Suspense Boundary Global do Dashboard */}
          <Suspense fallback={<LoadingScreen />}>
            {children}
          </Suspense>
        </main>
      </div>
    </div>
  );
}

