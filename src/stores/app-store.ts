import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AppState {
  sidebarOpen: boolean;
  toggleSidebar: () => void;
  commandPaletteOpen: boolean;
  setCommandPaletteOpen: (open: boolean) => void;
  toggleCommandPalette: () => void;
  activeTenantId: string | null;
  setActiveTenant: (id: string) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      sidebarOpen: true,
      toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
      commandPaletteOpen: false,
      setCommandPaletteOpen: (open) => set({ commandPaletteOpen: open }),
      toggleCommandPalette: () => set((state) => ({ commandPaletteOpen: !state.commandPaletteOpen })),
      activeTenantId: null,
      setActiveTenant: (id) => set({ activeTenantId: id }),
    }),
    {
      name: 'marcenai-app-store',
      partialize: (state) => ({ sidebarOpen: state.sidebarOpen, activeTenantId: state.activeTenantId }),
    }
  )
);

