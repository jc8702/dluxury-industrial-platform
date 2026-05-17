'use client';

import { useUIStore } from '@/stores/ui/ui.store';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';
import { CommandPalette } from './CommandPalette';

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const isSidebarOpen = useUIStore((state) => state.isSidebarOpen);

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar />
      <div
        className={`flex-1 flex flex-col transition-all duration-300 ease-in-out ${
          isSidebarOpen ? 'ml-64' : 'ml-16'
        }`}
      >
        <Topbar />
        <main className="flex-1 overflow-auto p-6 bg-muted/20">
          <div className="mx-auto max-w-7xl h-full">
            {children}
          </div>
        </main>
      </div>
      <CommandPalette />
    </div>
  );
}
