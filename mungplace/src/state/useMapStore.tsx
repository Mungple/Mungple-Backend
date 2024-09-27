// src/state/useMapStore.ts
import { create } from 'zustand'; // 상태 관리 store

// zone의 구조를 정의
export interface Zone {
  latitude: number;
  longitude: number;
  weight?: number; // 히트맵 가중치는 optional하게
}

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
  showPersonalBlueZone: boolean; // show가 붙은 것 => 토글
  showGlobalBlueZone: boolean;
  showRedZone: boolean;
  showMungPlace: boolean;
  showUserMarkers: boolean;
  personalBlueZones: Zone[];
  globalBlueZones: Zone[];
  redZones: Zone[];
  mungPlaces: Zone[];
  markers: MarkerData[] // 이게 myMarkers랑 동일함, 즉 내 마커
  nearbyMarkers: MarkerData[] // 주변 마커, 마커랑 통합할 지 고민
  togglePersonalBlueZone: () => void; // toggle이 붙은 함수 => 토글할거임
  toggleGlobalBlueZone: () => void;
  toggleRedZone: () => void;
  toggleMungPlace: () => void;
  fetchPersonalBlueZone: (latitude: number, longitude: number) => void;
  fetchGlobalBlueZone: (latitude: number, longitude: number) => void;
  fetchRedZone: (latitude: number, longitude: number) => void;
  fetchMungPlace: (latitude: number, longitude: number) => void;
  addMarker: (marker: MarkerData) => void; // 마커 추가용 함수
  setNearbyMarkers: (markers: MarkerData[]) => void // 주변 마커 설정 함수인데 수정필요할듯
  setMarkers: (markers: MarkerData[] ) => void
}



export const useMapStore = create<MapState>((set) => ({
  showPersonalBlueZone: true, // 초기 상태는 보이게
  showGlobalBlueZone: true,
  showRedZone: true,
  showMungPlace: true,
  showUserMarkers: true,
  personalBlueZones: [],
  globalBlueZones: [],
  redZones: [],
  mungPlaces: [],
  markers: [], // 내 마커
  nearbyMarkers: [], // 주변 마커 (내 마커 + 다른 사용자 마커)

  togglePersonalBlueZone: () => set((state) => ({ showPersonalBlueZone: !state.showPersonalBlueZone })),
  toggleGlobalBlueZone: () => set((state) => ({ showGlobalBlueZone: !state.showGlobalBlueZone })),
  toggleRedZone: () => set((state) => ({ showRedZone: !state.showRedZone })),
  toggleMungPlace: () => set((state) => ({ showMungPlace: !state.showMungPlace })),
  toggleUserMarkers: () => set((state) => ({ showUserMarkers: !state.showUserMarkers })),

  // 개인 블루존을 가져오는 비동기 함수
  fetchPersonalBlueZone: async (latitude: number, longitude: number) => {
    try {
      // 삼성 전기 근처 좌표를 사용한 더미 데이터
      const dummyData = [
        { latitude: 35.096, longitude: 128.854, weight: 10 },
        { latitude: 35.097, longitude: 128.855, weight: 15 },
        { latitude: 35.095, longitude: 128.852, weight: 20 },
      ];
      set({ personalBlueZones: dummyData });
    } catch (error) {
      console.error('Failed to fetch personal blue zone', error);
    }
  },

  // 전체 블루존 데이터를 가져오는 함수
  fetchGlobalBlueZone: async (latitude: number, longitude: number) => {
    try {
      // 삼성 전기 근처 좌표를 사용한 더미 데이터
      const dummyData = [
        { latitude: 35.096, longitude: 128.854, weight: 10 },
        { latitude: 35.097, longitude: 128.855, weight: 15 },
        { latitude: 35.095, longitude: 128.852, weight: 20 },
      ];
      set({ globalBlueZones: dummyData });
    } catch (error) {
      console.error('Failed to fetch global blue zone', error);
    }
  },

  // 레드존을 가져오는 비동기 함수
  fetchRedZone: async (latitude: number, longitude: number) => {
    try {
      // 삼성 전기 근처 좌표를 사용한 더미 데이터
      const dummyData = [
        { latitude: 35.096, longitude: 128.854, weight: 10 },
        { latitude: 35.097, longitude: 128.855, weight: 15 },
        { latitude: 35.095, longitude: 128.852, weight: 20 },
      ];
      set({ redZones: dummyData });
    } catch (error) {
      console.error('Failed to fetch red zone', error);
    }
  },

  // 멍플레이스 데이터를 가져오는 비동기 함수
  fetchMungPlace: async (latitude: number, longitude: number) => {
    try {
      // 삼성 전기 근처 좌표를 사용한 더미 데이터
      const dummyData = [
        { latitude: 35.096, longitude: 128.854 },
        { latitude: 35.097, longitude: 128.855 },
        { latitude: 35.095, longitude: 128.852 },
      ];
      set({ mungPlaces: dummyData });
    } catch (error) {
      console.error('Failed to fetch mung place', error);
    }
  },

  addMarker: (marker) => set((state) => ({
    markers: [...state.markers, marker],
    nearbyMarkers: [...state.nearbyMarkers, marker],
  })),

  setNearbyMarkers: (markers) => set({ nearbyMarkers: markers }), // 주변 마커 설정
  setMarkers: (markers) => set({ markers: markers})
}));
