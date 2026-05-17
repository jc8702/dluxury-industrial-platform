import { create } from 'zustand';

interface AppState {
  sidebarOpen: boolean;
  toggleSidebar: () => void;
  commandPaletteOpen: boolean;
  toggleCommandPalette: () => void;
  activeTenantId: string | null;
  setActiveTenant: (id: string) => void;
}

export const useAppStore = create<AppState>((set) => ({
  sidebarOpen: true,
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  commandPaletteOpen: false,
  toggleCommandPalette: () => set((state) => ({ commandPaletteOpen: !state.commandPaletteOpen })),
  activeTenantId: null,
  setActiveTenant: (id) => set({ activeTenantId: id }),
}));
