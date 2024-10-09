import { create } from 'zustand';
import { StartExplorate } from '@/types';

interface AppState {
  token: string | null;
  isLogin: boolean;
  startExplorate: StartExplorate | null;

  setToken: (value: string) => void;
  setLogin: (value: boolean) => void;
  setStartExplorate: (value: StartExplorate) => void;
}

export const useAppStore = create<AppState>((set) => ({
  token: '',
  isLogin: false,
  startExplorate: null,

  setToken: (value: string) => set({ token: value }),
  setLogin: (value: boolean) => set({ isLogin: value }),
  setStartExplorate: (value: StartExplorate) => set({ startExplorate: value }),
}));
