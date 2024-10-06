import React, { useEffect, useState } from 'react';
import useUserLocation from '@/hooks/useUserLocation';
import useWebsocketActions from '@/hooks/useWebsocketActions';

interface MungZone {
  point: {
    lat: number;
    lon: number;
  };
}

type AllBlueZoneHeatmapProps = {
  mungZone: MungZone | null;
};

const AllBlueZoneHeatmap = ({ mungZone }: AllBlueZoneHeatmapProps) => {
  const { userLocation } = useUserLocation(); // 사용자 위치 가져오기
  const { checkMungPlace } = useWebsocketActions();
  const visibleElements = useState(true);

  // 사용자 위치 변경 시 블루존 요청
  useEffect(() => {
    if (userLocation) {
      const centerLat = userLocation.latitude;
      const centerLon = userLocation.longitude;

      // 반경 1000미터 내 블루존 요청
      const zoneData: MungZone = {
        point: { lat: centerLat, lon: centerLon },
      };
      checkMungPlace(zoneData);
    }
  }, [userLocation, checkMungPlace]);

  // console.log("visibleElements:", visibleElements);
  // console.log("myBlueZone:", myBlueZone);
  // console.log("Heatmap Point:", myBlueZone.cells)

  return (
    <>
      {/* 멍존 렌더링
      {visibleElements && mungZone && (
        
      )} */}
    </>
  );
};

export default AllBlueZoneHeatmap;
