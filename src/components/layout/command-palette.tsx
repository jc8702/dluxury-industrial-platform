'use client';

import { Command } from 'cmdk';
import { useAppStore } from '@/stores/app-store';
import { Search, FolderSync, Box, Wrench } from 'lucide-react';
import { useRouter } from 'next/navigation';

export function CommandPalette() {
  const { commandPaletteOpen, setCommandPaletteOpen } = useAppStore();
  const router = useRouter();

  if (!commandPaletteOpen) return null;

  return (
    <div 
      onClick={(e) => {
        // Fechar ao clicar fora do card (no backdrop)
        if (e.target === e.currentTarget) {
          setCommandPaletteOpen(false);
        }
      }}
      className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh] bg-black/60 backdrop-blur-sm"
    >
      <div className="w-full max-w-xl bg-[#1A1D24] border border-slate-800 rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <Command label="Command Menu" className="w-full" shouldFilter={true}>
          <div className="flex items-center border-b border-slate-800 px-3">
            <Search className="w-5 h-5 text-slate-400 mr-2" />
            <Command.Input 
              autoFocus 
              placeholder="O que você precisa acessar? (Projetos, SketchUp, IA...)" 
              className="flex-1 bg-transparent border-none text-white p-4 focus:outline-none placeholder:text-slate-500 text-sm" 
            />
          </div>
          
          <Command.List className="max-h-[300px] overflow-y-auto p-2">
            <Command.Empty className="p-4 text-center text-sm text-slate-500">Nenhum resultado encontrado.</Command.Empty>
            
            <Command.Group heading="Engenharia" className="text-xs font-semibold text-slate-500 px-2 py-1">
              <Command.Item 
                onSelect={() => { router.push('/sketchup'); setCommandPaletteOpen(false); }}
                className="flex items-center px-3 py-3 text-sm text-slate-300 rounded-md hover:bg-slate-800 cursor-pointer aria-selected:bg-slate-800 aria-selected:text-white transition-colors"
              >
                <FolderSync className="w-4 h-4 mr-3 text-blue-400" /> Sincronizar SketchUp
              </Command.Item>
              <Command.Item 
                onSelect={() => { router.push('/engenharia'); setCommandPaletteOpen(false); }}
                className="flex items-center px-3 py-3 text-sm text-slate-300 rounded-md hover:bg-slate-800 cursor-pointer aria-selected:bg-slate-800 aria-selected:text-white transition-colors"
              >
                <Box className="w-4 h-4 mr-3 text-emerald-400" /> Motor Paramétrico
              </Command.Item>
            </Command.Group>
            
            <Command.Group heading="Produção" className="text-xs font-semibold text-slate-500 px-2 py-1 mt-2">
              <Command.Item 
                onSelect={() => { router.push('/producao'); setCommandPaletteOpen(false); }}
                className="flex items-center px-3 py-3 text-sm text-slate-300 rounded-md hover:bg-slate-800 cursor-pointer aria-selected:bg-slate-800 aria-selected:text-white transition-colors"
              >
                <Wrench className="w-4 h-4 mr-3 text-orange-400" /> Ordens de Produção (Chão de Fábrica)
              </Command.Item>
            </Command.Group>
          </Command.List>
        </Command>
      </div>
    </div>
  );
}

