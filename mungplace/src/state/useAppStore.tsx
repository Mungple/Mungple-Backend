import {create} from 'zustand';
import {Exploration, StartExplorate} from '@/types';

interface AppState {
  token : string | null
  isLogin: boolean;
  walkingStart: boolean;
  startExplorate: StartExplorate | null;

  setToken: (value: string) => void;
  setLogin: (value: boolean) => void;
  setWalkingStart: (value: boolean) => void;
  setStartExplorate: (value: StartExplorate) => void;
}

export const useAppStore = create<AppState>(set => ({
  token: '',
  isLogin: false,
  walkingStart: false,
  startExplorate: null,

  setToken: (value: string) => set({token: value}),
  setLogin: (value: boolean) => set({isLogin: value}),
  setWalkingStart: (value: boolean) => set({walkingStart: value}),
  setStartExplorate: (value: StartExplorate) => set({startExplorate: value}),
}));
