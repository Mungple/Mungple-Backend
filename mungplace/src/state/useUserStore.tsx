import { ResponsePetProfile, UserProfile } from '@/types';
import { LatLng } from 'react-native-maps';
import { create } from 'zustand';

interface UserState {
  userId: number;
  petData: ResponsePetProfile[];
  userData: UserProfile;
  userLocation: LatLng | null;

  setUserId: (value: number) => void;
  setPetData: (value: ResponsePetProfile[]) => void;
  setUserData: (value: UserProfile) => void;
  setUserLocation: (value: LatLng | null) => void;
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
  userLocation: null,

  setUserId: (value: number) => set({ userId: value }),
  setPetData: (value: ResponsePetProfile[]) => set({ petData: value }),
  setUserData: (value: UserProfile) => set({ userData: value }),
  setUserLocation: (value: LatLng | null) => set({ userLocation: value }),
}));
