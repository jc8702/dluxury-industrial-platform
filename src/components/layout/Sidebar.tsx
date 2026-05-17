'use client';

import { useUIStore } from '@/stores/ui/ui.store';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Users, 
  Building2, 
  FolderKanban, 
  Ruler, 
  Factory, 
  Library, 
  Bot, 
  Settings,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { cn } from '@/lib/utils';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Projetos', href: '/dashboard/projetos', icon: FolderKanban },
  { name: 'Engenharia', href: '/dashboard/engenharia', icon: Ruler },
  { name: 'Produção', href: '/dashboard/producao', icon: Factory },
  { name: 'Clientes', href: '/dashboard/clientes', icon: Users },
  { name: 'Biblioteca Técnica', href: '/dashboard/biblioteca', icon: Library },
  { name: 'Assistente IA', href: '/dashboard/ia', icon: Bot },
  { name: 'Administração', href: '/dashboard/admin', icon: Settings },
];

export function Sidebar() {
  const { isSidebarOpen, toggleSidebar } = useUIStore();
  const pathname = usePathname();

  return (
    <aside
      className={cn(
        "fixed inset-y-0 left-0 z-50 flex flex-col border-r bg-background transition-all duration-300 ease-in-out",
        isSidebarOpen ? "w-64" : "w-16"
      )}
    >
      <div className="flex h-16 items-center justify-between px-4 border-b">
        <div className={cn("flex items-center gap-2", !isSidebarOpen && "hidden")}>
          <div className="h-8 w-8 rounded-md bg-primary flex items-center justify-center text-primary-foreground font-bold">
            M
          </div>
          <span className="font-semibold text-lg tracking-tight">MarcenAI</span>
        </div>
        <button
          onClick={toggleSidebar}
          className="p-1 rounded-md hover:bg-muted transition-colors"
          aria-label="Toggle Sidebar"
        >
          {isSidebarOpen ? <ChevronLeft size={20} /> : <ChevronRight size={20} className="mx-auto" />}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto py-4">
        <nav className="space-y-1 px-2">
          {navigation.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  isActive 
                    ? "bg-primary/10 text-primary" 
                    : "text-muted-foreground hover:bg-muted hover:text-foreground",
                  !isSidebarOpen && "justify-center px-0"
                )}
                title={!isSidebarOpen ? item.name : undefined}
              >
                <item.icon size={20} className={cn("shrink-0", isActive && "text-primary")} />
                {isSidebarOpen && <span>{item.name}</span>}
              </Link>
            );
          })}
        </nav>
      </div>
      
      <div className="border-t p-4">
        <div className={cn("flex items-center gap-3", !isSidebarOpen && "justify-center")}>
          <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center shrink-0">
            <span className="text-xs font-medium">US</span>
          </div>
          {isSidebarOpen && (
            <div className="flex flex-col truncate">
              <span className="text-sm font-medium truncate">Usuário Atual</span>
              <span className="text-xs text-muted-foreground truncate">Engenheiro</span>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
