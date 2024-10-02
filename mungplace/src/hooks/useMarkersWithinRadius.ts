import axiosInstance from "@/api/axios";
import React from "react";
import { useFocusEffect } from "@react-navigation/native";
import { useMapStore } from "@/state/useMapStore";
import useUserLocation from "@/hooks/useUserLocation";

const useMarkersWithinRadius = () => { 
  const { setNearbyMarkers} = useMapStore((state) => ({
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
          markerType: 'BLUE',
        },
      });
      console.log("근처 마커 조회 응답:", response.data);

      const nearbyMarkersFromServer = response.data.markersGroupedByGeohash;
      const flattenedMarkers = [];

      for (const geohash in nearbyMarkersFromServer) {
        flattenedMarkers.push(...nearbyMarkersFromServer[geohash].markers);
      }

      setNearbyMarkers(flattenedMarkers);
    } catch (error) {
      console.error("주변 마커 조회에 실패함", error.response ? error.response.data : error.message);
    }
  };

  useFocusEffect(
   React.useCallback(() => {
    if (userLocation) {
      fetchNearbyMarkers() // 사용자의 위치가 있으면 마커 조회
    }
   }, [userLocation])
  )
  return null; // 상태 관리만 하니까 렌더링 필요 x
};

export default useMarkersWithinRadius;
