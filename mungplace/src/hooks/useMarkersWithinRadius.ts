import axiosInstance from "@/api/axios";
import { useEffect } from "react";
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
          markerType: 'ALL',
        },
      });
      console.log("근처 마커 조회 응답:", response.data);

      const nearbyMarkersFromServer = response.data.markerGroupedByGeohash;
      const flattenedMarkers = [];

      for (const geohash in nearbyMarkersFromServer) {
        flattenedMarkers.push(...nearbyMarkersFromServer[geohash].markers);
      }

      setNearbyMarkers(flattenedMarkers);
    } catch (error) {
      console.error("주변 마커 조회에 실패함", error.response ? error.response.data : error.message);
    }
  };

  useEffect(() => {
    let isMounted = true; // 마운트 상태 확인

    const fetchMarkersIfMounted = async () => {
      if (isMounted && userLocation) {
        await fetchNearbyMarkers();
      }
    };

    fetchMarkersIfMounted();

    return () => {
      isMounted = false; // 컴포넌트 언마운트 시 상태 업데이트 방지
    };
 }, [userLocation]);

  return null; // 상태 관리만 하니까 렌더링 필요 x
};

export default useMarkersWithinRadius;
