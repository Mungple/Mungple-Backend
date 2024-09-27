// useMarkersWithinRadius.ts
import axiosInstance from "@/api/axios";
import { useEffect } from "react";
import { useMapStore } from "@/state/useMapStore";
import useUserLocation from "@/hooks/useUserLocation";

const nearbyMarkers = () => {
  // 상태 관리 훅
  const { setNearbyMarkers, myMarkers } = useMapStore((state) => ({
    setNearbyMarkers : state.setNearbyMarkers,
    myMarkers: state.markers,
  }))

  // 사용자 위치 설정
  const { userLocation } = useUserLocation()

  // 주변 마커 가져오기
  const fetchNearbyMarkers = async () => {
    try {
      const response = await axiosInstance.get('/markers', {
        headers : {
          'Content-Type' : 'application/json; charset=utf8',
        },
        data : {
          radius: 500, // 값을 뭘 주든 500m 참조함
          latitude : userLocation.latitude,
          longitude : userLocation.longitude,
          markerType : 'ALL'
        },
      })

      const nearbyMarkersFromServer = response.data.markerGroupedByGeohash
      const flattenedMarkers = []

      // 마커 데이터 평탄화 
      for (const geohash in nearbyMarkersFromServer) {
        flattenedMarkers.push(...nearbyMarkersFromServer[geohash].markers)
      }

      // 내 마커와 서버에서 가져온 마커를 통합
      const allMarkers = [...myMarkers, ...flattenedMarkers]

      // 상태 업데이트
      setNearbyMarkers(allMarkers)
    } catch (error) {
      console.error("주변 마커 조회에 실패함", error)
    }
  }

  // 컴포넌트 마운트 시 주변 마커 조회
  useEffect(() => {
    fetchNearbyMarkers()
  }, [])

  return null // 여기선 상태 관리만 하니까 렌더링 필요 x
}

export default nearbyMarkers