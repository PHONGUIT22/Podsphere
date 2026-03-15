// src/store/useUIStore.ts
import { create } from 'zustand';

interface UIState {
  isSidebarOpen: boolean;
  isDarkMode: boolean;
  toggleSidebar: () => void;
  closeSidebar: () => void;
  toggleTheme: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  isSidebarOpen: false,
  isDarkMode: false, // Mặc định là light hoặc mày check localStorage
  toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
  closeSidebar: () => set({ isSidebarOpen: false }),
  toggleTheme: () => set((state) => {
    const nextMode = !state.isDarkMode;
    if (nextMode) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
    return { isDarkMode: nextMode };
  }),
}));