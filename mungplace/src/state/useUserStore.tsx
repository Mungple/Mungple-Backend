import { ResponsePetProfile, UserProfile } from '@/types';
import { create } from 'zustand';

interface UserState {
  userId: number;
  petData: ResponsePetProfile[];
  userData: UserProfile;

  setUserId: (value: number) => void;
  setPetData: (value: ResponsePetProfile[]) => void;
  setUserData: (value: UserProfile) => void;
}

export const useUserStore = create<UserState>((set) => ({
  userId: 0,
  petData: [],
  userData: {
    userId: 0,
    nickname: '',
    imageName: null,
    createdAt: '',
  },

  setUserId: (value: number) => set({ userId: value }),
  setPetData: (value: ResponsePetProfile[]) => set({ petData: value }),
  setUserData: (value: UserProfile) => set({ userData: value }),
}));
