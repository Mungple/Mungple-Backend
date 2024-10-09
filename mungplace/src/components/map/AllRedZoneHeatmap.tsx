import React, { useEffect } from 'react';
import { Heatmap } from 'react-native-maps';

import { FromZone, ToZone } from '@/types';
import { useUserStore } from '@/state/useUserStore';

type AllRedZoneHeatmapProps = {
  allRedZone: FromZone | null;
  checkAllUserZone: (zoneType: number, allUserZone: ToZone) => void;
};

const AllRedZoneHeatmap = ({ allRedZone, checkAllUserZone }: AllRedZoneHeatmapProps) => {
  const userLocation = useUserStore((state) => state.userLocation);
  // const requestId = Math.random().toString(36).substr(2, 9);
  // 사용자 위치 변경 시 블루존 요청
  useEffect(() => {
    if (userLocation) {
      const centerLat = userLocation.latitude;
      const centerLon = userLocation.longitude;

      // 반경 1000미터 내 블루존 요청
      const zoneData: ToZone = {
        // requestId: requestId,
        side: 500,
        point: { lat: centerLat, lon: centerLon },
      };
      checkAllUserZone(1, zoneData);
    }
  }, [userLocation, checkAllUserZone]);

  // console.log("visibleElements:", visibleElements);
  // console.log("myBlueZone:", myBlueZone);
  // console.log("Heatmap Point:", myBlueZone.cells)

  return (
    <>
      {/* 레드존 히트맵 렌더링 */}
      {allRedZone && allRedZone.cells && allRedZone.cells.length > 0 && (
        <Heatmap
          points={allRedZone.cells.map((cell) => ({
            latitude: cell.point.lat,
            longitude: cell.point.lon,
            weight: cell.weight,
          }))}
          gradient={{
            colors: ['red', 'darkred'],
            startPoints: [0.2, 1.0],
            colorMapSize: 256,
          }}
        />
      )}
    </>
  );
};

export default AllRedZoneHeatmap;
