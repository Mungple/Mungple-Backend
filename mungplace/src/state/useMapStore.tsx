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

// 내 마커 데이터 인터페이스
export interface MyMarkerData {
  markerId: string;
  title: string;
  createdAt: string;
  markerType: "ALL"
  latitude: number;
  longitude: number;
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
  markers: MarkerData[]; // 마커 추가 로직
  myMarkers: MyMarkerData[]
  showUserMarkers: boolean;
  petFacilities: PetFacility[];
  nearbyMarkers: NearbyMarkersData | null;

  toggleUserMarkers: () => void;
  addMarker: (value: MarkerData) => void;
  setMarkers: (value: MarkerData[]) => void;
  setMyMarkers: (value: MyMarkerData[]) => void
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
  setMyMarkers: (newMarkers: MyMarkerData[]) => set((state) => ({ myMarkers: [...state.myMarkers, ...newMarkers]})),
  setPetFacilities: (value: PetFacility[]) => set({ petFacilities: value }),
  setNearbyMarkers: (value: NearbyMarkersData) => set({ nearbyMarkers: value }),
  toggleUserMarkers: () => set((state) => ({ showUserMarkers: !state.showUserMarkers })),
  addMarker: (value: MarkerData) => set((state) => ({ markers: [...state.markers, value] })),
}));
