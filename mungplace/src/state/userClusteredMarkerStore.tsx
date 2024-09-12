import { useMemo } from 'react';
import cluster from 'points-cluster'; // 클러스터링 라이브러리

interface Marker {
  id: string;
  latitude: number;
  longitude: number;
  title: string;
  body: string;
  imageUri?: string;
}

export const useClusteredMarkers = (markers: Marker[]) => {
  return useMemo(() => {
    // 클러스터링 로직
    const clustered = cluster(markers.map(marker => ({
      ...marker,
      latitude: marker.latitude,
      longitude: marker.longitude,
    })), { radius: 50 });

    return clustered;
  }, [markers]);
};
