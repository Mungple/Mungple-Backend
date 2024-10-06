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
  addMarker: (marker: MarkerData) => void; // 마커 추가용 함수
  setMarkers: (markers: MarkerData[]) => void;
  setNearbyMarkers: (clusters: NearbyMarkersData) => void; // 주변 마커 설정 함수인데 수정필요할듯
  getGeohashCenter: (hashKey: string) => { lat: number; lon: number } | null;
  setPetFacilities: (value: PetFacility[]) => void;
}

export const useMapStore = create<MapState>((set) => ({
  markers: [], // 내 마커
  nearbyMarkers: null, // 주변 마커 (내 마커 + 다른 사용자 마커)
  petFacilities: [],
  showUserMarkers: true,
  toggleUserMarkers: () => set((state) => ({ showUserMarkers: !state.showUserMarkers })),

  getGeohashCenter: (hashKey) => {
    const nearbyMarkers = get().nearbyMarkers; // get()을 통해 상태에 접근
    if (!nearbyMarkers) return null; // nearbyMarkers가 null일 경우
    const cluster = nearbyMarkers.markersGroupedByGeohash[hashKey];
    return cluster ? cluster.geohashCenter : null;
  },

  addMarker: (marker) =>
    set((state) => ({
      markers: [...state.markers, marker],
    })),

  setNearbyMarkers: (clusters: NearbyMarkersData) =>
    set(() => ({
      nearbyMarkers: clusters,
    })), // 주변 마커 설정
  setMarkers: (markers: MarkerData[]) =>
    set(() => ({
      markers: markers,
    })),
  setPetFacilities: (value: PetFacility[]) => set({ petFacilities: value }),
}));
