import React, { useEffect } from 'react';
import { Heatmap } from 'react-native-maps';
import { colors } from '@/constants';
import { FromZone, ToZone } from '@/types';
import useUserLocation from '@/hooks/useUserLocation';

type MyBlueZoneHeatmapProps = {
  myBlueZone: FromZone | null;
  checkMyBlueZone: (myBlueZone: ToZone) => void;
};

const MyBlueZoneHeatmap = ({ myBlueZone, checkMyBlueZone }: MyBlueZoneHeatmapProps) => {
  const { userLocation } = useUserLocation();
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
