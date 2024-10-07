import { Location, ResponsePetProfile, UserProfile } from '@/types';
import { create } from 'zustand';

interface UserState {
  userId: number;
  petData: ResponsePetProfile[];
  userData: UserProfile;
  userLocation: Location;

  setUserId: (value: number) => void;
  setPetData: (value: ResponsePetProfile[]) => void;
  setUserData: (value: UserProfile) => void;
  setUserLocation: (value: Location) => void;
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
  userLocation: {
    lat: 35.096406,
    lon: 128.853919,
  },

  setUserId: (value: number) => set({ userId: value }),
  setPetData: (value: ResponsePetProfile[]) => set({ petData: value }),
  setUserData: (value: UserProfile) => set({ userData: value }),
  setUserLocation: (value: Location) => set({ userLocation: value }),
}));
