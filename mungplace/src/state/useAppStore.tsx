import {create} from 'zustand';

interface AppState {
  isLogin: boolean;
  walkingStart: boolean;
  setLogin: (value: boolean) => void;
  setWalkingStart: (value: boolean) => void;
  token : string | null
  setToken : (token : string ) => void
}

export const useAppStore = create<AppState>(set => ({
  isLogin: false,
  token: null,
  walkingStart: false,
  setLogin: (value: boolean) => set({isLogin: value}),
  setWalkingStart: (value: boolean) => set({walkingStart: value}),
  setToken: (token) => set({token})
}));
