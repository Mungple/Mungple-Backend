// src/state/useMapStore.ts
import { create } from 'zustand'; // 상태 관리 store

// 마커 데이터 인터페이스
export interface MarkerData {
  markerId: string
  latitude: number
  longitude: number
  title: string
  body: string
  imageUri?: string // 마커에 사용될 이미지 uri도 선택적임
  explorationId?: number // 있으면 산책임
  type: 'BLUE' | 'RED'
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

// 맵 화면의 상태 정의
interface MapState {
  showUserMarkers: boolean;
  markers: MarkerData[] // 이게 myMarkers랑 동일함, 즉 내 마커
  nearbyMarkers: MarkerData[] // 주변 마커, 마커랑 통합할 지 고민
  addMarker: (marker: MarkerData) => void; // 마커 추가용 함수
  setNearbyMarkers: (markers: MarkerData[]) => void // 주변 마커 설정 함수인데 수정필요할듯
  setMarkers: (markers: MarkerData[] ) => void
}



export const useMapStore = create<MapState>((set) => ({
  showUserMarkers: true,
  markers: [], // 내 마커
  nearbyMarkers: [], // 주변 마커 (내 마커 + 다른 사용자 마커)
  toggleUserMarkers: () => set((state) => ({ showUserMarkers: !state.showUserMarkers })),

  

  addMarker: (marker) => set((state) => ({
    markers: [...state.markers, marker],
    nearbyMarkers: [...state.nearbyMarkers, marker],
  })),

  setNearbyMarkers: (markers) => set({ nearbyMarkers: markers }), // 주변 마커 설정
  setMarkers: (markers) => set({ markers: markers})
}));