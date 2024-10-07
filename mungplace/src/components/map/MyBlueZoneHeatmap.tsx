import React, { useEffect } from 'react';
import { Heatmap } from 'react-native-maps';
import { colors } from '@/constants';
import { FromZone, ToZone } from '@/types';
import { useUserStore } from '@/state/useUserStore';

type MyBlueZoneHeatmapProps = {
  myBlueZone: FromZone | null;
  checkMyBlueZone: (myBlueZone: ToZone) => void;
};

const MyBlueZoneHeatmap = ({ myBlueZone, checkMyBlueZone }: MyBlueZoneHeatmapProps) => {
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
      checkMyBlueZone(zoneData);
    }
  }, [userLocation, checkMyBlueZone]);

  return (
    <>
      {/* 개인 블루존 히트맵 렌더링 */}
      {myBlueZone && myBlueZone.cells && myBlueZone.cells.length > 0 && (
        <Heatmap
          points={myBlueZone.cells.map((cell) => ({
            latitude: cell.point.lat,
            longitude: cell.point.lon,
            weight: cell.weight,
          }))}
          gradient={{
            colors: [colors.BEIGE.LIGHTER, colors.BLUE.BASE],
            startPoints: [0.2, 1.0],
            colorMapSize: 256,
          }}
        />
      )}
    </>
  );
};

export default MyBlueZoneHeatmap;
