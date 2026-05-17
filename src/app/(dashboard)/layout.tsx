'use client';

import { Suspense } from 'react';
import { IndustrialSidebar } from '@/components/layout/industrial-sidebar';
import { Topbar } from '@/components/layout/topbar';
import { CommandPalette } from '@/components/layout/command-palette';
import { useAppStore } from '@/stores/app-store';
import LoadingScreen from './loading';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { sidebarOpen } = useAppStore();

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
