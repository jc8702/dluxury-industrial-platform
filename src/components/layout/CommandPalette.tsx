'use client';

import { useEffect } from 'react';
import { useUIStore } from '@/stores/ui/ui.store';

export function CommandPalette() {
  const { isCommandPaletteOpen, toggleCommandPalette } = useUIStore();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        toggleCommandPalette();
      }
    };

    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, [toggleCommandPalette]);

  if (!isCommandPaletteOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-start justify-center pt-[20vh]">
      <div className="bg-popover border text-popover-foreground rounded-lg shadow-lg w-full max-w-lg overflow-hidden relative">
        <div className="flex items-center border-b px-3">
          <input 
            type="text" 
            placeholder="Buscar projetos, clientes, ou ações..." 
            className="flex h-12 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
            autoFocus
          />
        </div>
        <div className="max-h-[300px] overflow-y-auto p-2">
          <div className="text-xs text-muted-foreground px-2 py-1.5 font-medium">Sugestões</div>
          <button className="w-full text-left px-2 py-1.5 text-sm rounded-md hover:bg-muted hover:text-foreground">
            Criar novo Projeto
          </button>
          <button className="w-full text-left px-2 py-1.5 text-sm rounded-md hover:bg-muted hover:text-foreground">
            Gerenciar Engenharia
          </button>
          <button className="w-full text-left px-2 py-1.5 text-sm rounded-md hover:bg-muted hover:text-foreground">
            Ir para Configurações
          </button>
        </div>
        <button 
          onClick={toggleCommandPalette}
          className="absolute top-2 right-2 text-muted-foreground hover:text-foreground p-1"
        >
          ✕
        </button>
      </div>
    </div>
  );
}
