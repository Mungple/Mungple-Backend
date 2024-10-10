// 마커 데이터 인터페이스
interface MarkerData {
  markerId: string;
  latitude: number;
  longitude: number;
  title: string;
  body: string;
  imageUri?: string;
  explorationId?: number;
  type: 'BLUE' | 'RED';
}

interface MarkerId {
  markerId: string;
}

// 내 마커 데이터 인터페이스
interface MyMarkerData {
  markerId: string;
  title: string;
  createdAt: string;
  markerType: 'ALL';
  latitude: number;
  longitude: number;
}

// 마커 상세 정보 인터페이스
interface MarkerDetails {
  id: string;
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
interface NearbyMarkerData {
  markerId: string;
  userId: number;
  createdAt: string;
  type: string;
}

// 각각의 클러스터 데이터
interface ClusterData {
  count: number;
  geohashCenter: {
    lat: number;
    lon: number;
  };
  markers: NearbyMarkerData[];
}

// 주변 조회 전체를 받아오는 데이터
interface NearbyMarkersData {
  markersGroupedByGeohash: {
    [key: string]: ClusterData;
  };
}

export type {
  MarkerId,
  MarkerData,
  ClusterData,
  MyMarkerData,
  MarkerDetails,
  NearbyMarkerData,
  NearbyMarkersData,
};
