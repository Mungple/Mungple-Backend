import React, { useEffect } from 'react';
import { Heatmap } from 'react-native-maps';

import { colors } from '@/constants';
import { FromZone, ToZone } from '@/types';
import { useUserStore } from '@/state/useUserStore';

type AllBlueZoneHeatmapProps = {
  allBlueZone: FromZone | null;
  checkAllUserZone: (zoneType: number, allUserZone: ToZone) => void;
};

const AllBlueZoneHeatmap = ({ allBlueZone, checkAllUserZone }: AllBlueZoneHeatmapProps) => {
  const userLocation = useUserStore((state) => state.userLocation);

  // 사용자 위치 변경 시 블루존 요청
  useEffect(() => {
    if (userLocation) {
      const centerLat = userLocation.lat;
      const centerLon = userLocation.lon;

      // 반경 1000미터 내 블루존 요청
      const zoneData: ToZone = {
        side: 500,
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
          gradient={{
            colors: [colors.BLUE.BASE, colors.YELLOW.LIGHTER],
            startPoints: [0.2, 1.0],
            colorMapSize: 256,
          }}
        />
      )}
    </>
  );
};

export default AllBlueZoneHeatmap;
