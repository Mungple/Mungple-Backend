// useMarkersWithinRadius.ts
import axiosInstance from "@/api/axios";
import { useEffect, useState } from "react";
import { useMapStore } from "@/state/useMapStore";

const useMarkersWithinRadius = (latitude: number, longitude: number) => {
  const [loading, setLoading] = useState(true);
  const setNearbyMarkers = useMapStore((state) => state.setNearbyMarkers); // 상태 업데이트 함수 가져오기

  useEffect(() => {
    const fetchMarkers = async () => {
      setLoading(true);
      try {
        const response = await axiosInstance.post('/your-endpoint', {
          radius: 500,
          latitude,
          longitude,
          markerType: "ALL",
        });

        // 마커 데이터 가공
        const fetchedMarkers = Object.values(response.data.markersGroupedByGeohash).flatMap(group =>
          group.markers.map(marker => ({
            markerId: marker.markerId,
            latitude: group.geohashCenter.lat,
            longitude: group.geohashCenter.lon,
            type: marker.type,
            // 필요에 따라 title, body 추가
          }))
        );

        // Zustand 상태에 저장
        setNearbyMarkers(fetchedMarkers);
      } catch (error) {
        console.error('마커 가져오기 실패', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMarkers();
  }, [latitude, longitude, setNearbyMarkers]);

  return { loading };
};

export default useMarkersWithinRadius;
