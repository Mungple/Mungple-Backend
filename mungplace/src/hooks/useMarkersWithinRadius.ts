import React from 'react';
import { useUserStore } from '@/state/useUserStore';
import { useFocusEffect } from '@react-navigation/native';
import { useMapStore, NearbyMarkersData, ClusterData } from '@/state/useMapStore';
import { getNearbyMarkers } from '@/api/map';

// 마커 데이터를 조회하고 클러스터링하는 훅
const useMarkersWithinRadius = () => {
  const { setNearbyMarkers } = useMapStore((state) => ({
    setNearbyMarkers: state.setNearbyMarkers,
  }));

  const userLocation = useUserStore((state) => state.userLocation);

  const fetchNearbyMarkers = async () => {
    try {
      if (!userLocation) return;

      const nearbyMarkers = await getNearbyMarkers(userLocation.latitude, userLocation.longitude);

      const updatedNearbyMarkersData: NearbyMarkersData = {
        // 반환된 geohash 값들을 순회하며 acc(누적 객체)에 각 geohash와 관련된 데이터를 추가
        markersGroupedByGeohash: Object.keys(nearbyMarkers.markersGroupedByGeohash).reduce(
          (acc, geohash) => {
            const clusterData = nearbyMarkers.markersGroupedByGeohash[geohash];
            acc[geohash] = {
              geohashCenter: clusterData.geohashCenter, // geohashCenter 사용
              count: clusterData.markers.length, // 마커의 개수를 count로 설정
              markers: clusterData.markers, // 마커 배열 추가
            };
            return acc;
          },
          {} as { [key: string]: ClusterData },
        ),
      };

      // 변환한 데이터 저장소에 세팅
      setNearbyMarkers(updatedNearbyMarkersData);
    } catch (error) {
      console.error('주변 마커 조회에 실패함', error);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      if (userLocation) {
        fetchNearbyMarkers(); // 사용자의 위치가 있으면 마커 조회
      }
    }, [userLocation]),
  );
};

export default useMarkersWithinRadius;
