import axiosInstance from '@/api/axios';
import React from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { useMapStore, NearbyMarkersData, NearbyMarkerData, ClusterData } from '@/state/useMapStore';
import useUserLocation from '@/hooks/useUserLocation';

const useMarkersWithinRadius = () => {
  const { setNearbyMarkers } = useMapStore((state) => ({
    setNearbyMarkers: state.setNearbyMarkers,
  }));

  const { userLocation } = useUserLocation();

  const fetchNearbyMarkers = async () => {
    try {
      const response = await axiosInstance.get('/markers', {
        headers: {
          'Content-Type': 'application/json; charset=utf8',
        },
        params: {
          radius: 500,
          latitude: userLocation.latitude,
          longitude: userLocation.longitude,
          markerType: 'ALL',
        },
      });

      const nearbyMarkersFromServer: NearbyMarkersData = response.data.markersGroupedByGeohash;
      const clusters: { [key: string]: NearbyMarkerData[] } = {};

      Object.keys(nearbyMarkersFromServer).forEach((geohash) => {
        const clusterData = nearbyMarkersFromServer[geohash];
        clusterData.markers.forEach((marker) => {
          if (!clusters[geohash]) {
            clusters[geohash] = [];
          }
          clusters[geohash].push(marker);
        });
      });

      // clusters 객체를 NearbyMarkersData 형태로 변환
      const updatedNearbyMarkersData: NearbyMarkersData = {
        markersGroupedByGeohash: Object.keys(clusters).reduce((acc, geohash) => {
          acc[geohash] = {
            geohashCenter: nearbyMarkersFromServer[geohash].geohashCenter, // 기존의 geohashCenter 사용
            count: clusters[geohash].length, // 마커의 개수를 count로 설정
            markers: clusters[geohash], // 마커 배열 추가
          };
          return acc;
        }, {} as { [key: string]: ClusterData }),
      };
      // 변환한 데이터 저장소에 세팅
      setNearbyMarkers(updatedNearbyMarkersData); // 주변 마커 설정
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

  return null; // 상태 관리만 하니까 렌더링 필요 x
};

export default useMarkersWithinRadius;
