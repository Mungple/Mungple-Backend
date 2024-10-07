import { create } from 'zustand';
import { StartExplorate } from '@/types';
import { Client } from '@stomp/stompjs';

interface AppState {
  token: string | null;
  distance: number;
  isLogin: boolean;
  isSocket: boolean;
  walkingStart: boolean;
  clientSocket: Client | null;
  startExplorate: StartExplorate | null;

  setToken: (value: string) => void;
  setLogin: (value: boolean) => void;
  setDistance: (value: number) => void;
  setIsSocket: (value: boolean) => void;
  setWalkingStart: (value: boolean) => void;
  setClientSocket: (value: Client | null) => void;
  setStartExplorate: (value: StartExplorate) => void;
}

export const useAppStore = create<AppState>((set) => ({
  token: '',
  distance: 0,
  isLogin: false,
  isSocket: false,
  clientSocket: null,
  walkingStart: false,
  startExplorate: null,

  setToken: (value: string) => set({ token: value }),
  setLogin: (value: boolean) => set({ isLogin: value }),
  setDistance: (value: number) => set({ distance: value }),
  setIsSocket: (value: boolean) => set({ isSocket: value }),
  setWalkingStart: (value: boolean) => set({ walkingStart: value }),
  setClientSocket: (value: Client | null) => set({ clientSocket: value }),
  setStartExplorate: (value: StartExplorate) => set({ startExplorate: value }),
}));
