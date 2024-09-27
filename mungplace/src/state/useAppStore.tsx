import {create} from 'zustand';
import {Exploration} from '@/types';

interface AppState {
  isLogin: boolean;
  exploration: Exploration;
  walkingStart: boolean;
  setToken: (value: string) => void;
  setLogin: (value: boolean) => void;
  setWalkingStart: (value: boolean) => void;
  token : string | null
}

export const useAppStore = create<AppState>(set => ({
  token: '',
  isLogin: false,
  exploration: {explorationId: 0, distance: 0, startAt: '', endAt: ''},
  walkingStart: false,
  setToken: (value: string) => set({token: value}),
  setLogin: (value: boolean) => set({isLogin: value}),
  setWalkingStart: (value: boolean) => set({walkingStart: value}),
}));
