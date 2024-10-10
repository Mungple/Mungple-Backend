// src/state/useMapStore.ts
import { MarkerData, NearbyMarkersData, PetFacility } from '@/types';
import { create } from 'zustand'; // 상태 관리 store

// 맵 화면의 상태 정의
interface MapState {
  markers: MarkerData[]; // 마커 추가 로직
  showUserMarkers: boolean;
  petFacilities: PetFacility[];
  nearbyMarkers: NearbyMarkersData | null;

  toggleUserMarkers: () => void;
  addMarker: (value: MarkerData) => void;
  setMarkers: (value: MarkerData[]) => void;
  setPetFacilities: (value: PetFacility[]) => void;
  setNearbyMarkers: (value: NearbyMarkersData) => void;
}

export const useMapStore = create<MapState>((set) => ({
  markers: [],
  myMarkers: [],
  petFacilities: [],
  nearbyMarkers: null,
  showUserMarkers: true,

  setMarkers: (value: MarkerData[]) => set(() => ({ markers: value })),

  setPetFacilities: (value: PetFacility[]) => set({ petFacilities: value }),
  setNearbyMarkers: (value: NearbyMarkersData) => set({ nearbyMarkers: value }),
  toggleUserMarkers: () => set((state) => ({ showUserMarkers: !state.showUserMarkers })),
  addMarker: (value: MarkerData) => set((state) => ({ markers: [...state.markers, value] })),
}));