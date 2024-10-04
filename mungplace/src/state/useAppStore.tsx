import { create } from 'zustand';
import { StartExplorate } from '@/types';
import { Client } from '@stomp/stompjs';

interface AppState {
  token: string | null;
  isLogin: boolean;
  walkingStart: boolean;
  clientSocket: Client | null;
  startExplorate: StartExplorate | null;

  setToken: (value: string) => void;
  setLogin: (value: boolean) => void;
  setWalkingStart: (value: boolean) => void;
  setClientSocket: (value: Client | null) => void;
  setStartExplorate: (value: StartExplorate) => void;
}

export const useAppStore = create<AppState>((set) => ({
  token: '',
  isLogin: false,
  clientSocket: null,
  walkingStart: false,
  startExplorate: null,

  setToken: (value: string) => set({ token: value }),
  setLogin: (value: boolean) => set({ isLogin: value }),
  setClientSocket: (value: Client | null) => set({ clientSocket: value }),
  setWalkingStart: (value: boolean) => set({ walkingStart: value }),
  setStartExplorate: (value: StartExplorate) => set({ startExplorate: value }),
}));
