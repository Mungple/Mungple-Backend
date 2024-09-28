import {ResponsePetProfile} from '@/types';
import {create} from 'zustand';

interface UserState {
  userId: number | null;
  petData: ResponsePetProfile[];

  setUserId: (value: number) => void;
  setPetData: (value: ResponsePetProfile[]) => void;
}

export const useUserStore = create<UserState>(set => ({
  userId: null,
  petData: [],

  setUserId: (value: number) => set({userId: value}),
  setPetData: (value: ResponsePetProfile[]) => set({petData: value}),
}));
