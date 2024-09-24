import {create} from 'zustand';

interface AppState {
  token: string;
  isLogin: boolean;
  walkingStart: boolean;
  setToken: (value: string) => void;
  setLogin: (value: boolean) => void;
  setWalkingStart: (value: boolean) => void;
}

export const useAppStore = create<AppState>(set => ({
  token: '',
  isLogin: false,
  walkingStart: false,
  setToken: (value: string) => set({token: value}),
  setLogin: (value: boolean) => set({isLogin: value}),
  setWalkingStart: (value: boolean) => set({walkingStart: value}),
}));
