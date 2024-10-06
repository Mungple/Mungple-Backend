// src/state/useMapStore.ts
import { PetFacility } from '@/types';
import { create } from 'zustand'; // 상태 관리 store

// 마커 데이터 인터페이스
export interface MarkerData {
  markerId: string;
  latitude: number;
  longitude: number;
  title: string;
  body: string;
  imageUri?: string; // 마커에 사용될 이미지 uri도 선택적임
  explorationId?: number; // 있으면 산책임
  type: 'BLUE' | 'RED';
}

// 마커 상세 정보 인터페이스
export interface MarkerDetails {
  markerId: string;
  userId: number;
  point: {
    lat: number;
    lon: number;
  };
  title: string;
  content: string;
  type: string;
  images: string[];
  createdAt: string;
}

// 주변 조회 마커 (클러스터 내에 있는 마커) 인터페이스
export interface NearbyMarkerData {
  markerId: string;
  userId: number;
  createdAt: string;
  type: string;
}

// 각각의 클러스터 데이터
export interface ClusterData {
  geohashCenter: {
    lat: number;
    lon: number;
  };
  count: number;
  markers: NearbyMarkerData[];
}

// 주변 조회 전체를 받아오는 데이터
export interface NearbyMarkersData {
  markersGroupedByGeohash: {
    [key: string]: ClusterData;
  };
}

// 맵 화면의 상태 정의
interface MapState {
  markers: MarkerData[];
  showUserMarkers: boolean;
  petFacilities: PetFacility[];
  nearbyMarkers: NearbyMarkersData | null;

  toggleUserMarkers: () => void;
  addMarker: (value: MarkerData) => void;
  setMarkers: (value: MarkerData[]) => void;
  setPetFacilities: (value: PetFacility[]) => void;
  setNearbyMarkers: (value: NearbyMarkersData) => void;
  getGeohashCenter: (value: string) => { lat: number; lon: number } | null;
}

export const useMapStore = create<MapState>((set, get) => ({
  markers: [],
  petFacilities: [],
  nearbyMarkers: null,
  showUserMarkers: true,

  setMarkers: (value: MarkerData[]) => set(() => ({ markers: value })),
  setPetFacilities: (value: PetFacility[]) => set({ petFacilities: value }),
  setNearbyMarkers: (value: NearbyMarkersData) => set({ nearbyMarkers: value }),
  toggleUserMarkers: () => set((state) => ({ showUserMarkers: !state.showUserMarkers })),
  addMarker: (value: MarkerData) => set((state) => ({ markers: [...state.markers, value] })),
  getGeohashCenter: (hashKey) => {
    const { nearbyMarkers } = get();
    if (!nearbyMarkers || !nearbyMarkers.markersGroupedByGeohash[hashKey]) {
      return null;
    }
    return nearbyMarkers.markersGroupedByGeohash[hashKey].geohashCenter || null;
  },
}));
