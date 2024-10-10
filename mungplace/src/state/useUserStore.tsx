import { ResponsePetProfile, ResponseUserProfile } from '@/types';
import { LatLng } from 'react-native-maps';
import { create } from 'zustand';

interface UserState {
  userId: number;
  petData: ResponsePetProfile[];
  userData: ResponseUserProfile;
  userLocation: LatLng | null;

  setUserId: (value: number) => void;
  setPetData: (value: ResponsePetProfile[]) => void;
  setUserData: (value: ResponseUserProfile) => void;
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
  setUserData: (value: ResponseUserProfile) => set({ userData: value }),
  setUserLocation: (value: LatLng | null) => set({ userLocation: value }),
}));
