import React, { useEffect } from 'react';
import { Heatmap } from 'react-native-maps';
import useUserLocation from '@/hooks/useUserLocation';
import useWebsocketActions from '@/hooks/useWebsocketActions';
import { FromZone } from '@/hooks/useWebsocket';

interface ToZone {
  side: number;
  point: {
    lat: number;
    lon: number;
  };
}

type AllBlueZoneHeatmapProps = {
  allBlueZone: FromZone | null;
};

const AllBlueZoneHeatmap = ({ allBlueZone }: AllBlueZoneHeatmapProps) => {
  const { userLocation } = useUserLocation(); // 사용자 위치 가져오기
  const { checkAllUserZone } = useWebsocketActions();

  // 사용자 위치 변경 시 블루존 요청
  useEffect(() => {
    if (userLocation) {
      const centerLat = userLocation.latitude;
      const centerLon = userLocation.longitude;

      // 반경 1000미터 내 블루존 요청
      const zoneData: ToZone = {
        side: 1000,
        point: { lat: centerLat, lon: centerLon },
      };
      checkAllUserZone(0, zoneData);
    }
  }, [userLocation, checkAllUserZone]);

  // console.log("visibleElements:", visibleElements);
  // console.log("myBlueZone:", myBlueZone);
  // console.log("Heatmap Point:", myBlueZone.cells)

  return (
    <>
      {/* 블루존 히트맵 렌더링 */}
      {allBlueZone && allBlueZone.cells && allBlueZone.cells.length > 0 && (
        <Heatmap
          points={allBlueZone.cells.map((cell) => ({
            latitude: cell.point.lat,
            longitude: cell.point.lon,
            weight: cell.weight,
          }))}
        />
      )}
    </>
  );
};

export default AllBlueZoneHeatmap;
