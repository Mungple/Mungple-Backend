import React, { useEffect } from 'react';
import { useMapStore } from '@/state/useMapStore';
import { Marker, Circle } from 'react-native-maps';
import useUserLocation from '@/hooks/useUserLocation';
import useWebsocketActions from '@/hooks/useWebsocketActions';
import { MungZone as RQMungZone } from '@/hooks/useWebsocket';

interface MungZone {
  point: {
    lat: number;
    lon: number;
  };
}

type MungZoneHeatmapProps = {
  mungZone: RQMungZone | null;
};

const MungZoneHeatmap = ({ mungZone }: MungZoneHeatmapProps) => {
  const getGeohashCenter = useMapStore((state) => state.getGeohashCenter);
  const { checkMungPlace } = useWebsocketActions();
  const { userLocation } = useUserLocation(); // 사용자 위치 가져오기

  // 사용자 위치 변경 시 블루존 요청
  useEffect(() => {
    if (userLocation) {
      const centerLat = userLocation.latitude;
      const centerLon = userLocation.longitude;

      const zoneData: MungZone = {
        point: { lat: centerLat, lon: centerLon },
      };
      checkMungPlace(zoneData);
    }
  }, [userLocation, checkMungPlace]);
  return (
    <>
      {/* 멍존 렌더링 */}
      {mungZone && (
        <>
          {mungZone.map((zone: { geohash: string }) => {
            // geohash를 통해 geohashCenter 얻기
            const geohashCenter = getGeohashCenter(zone.geohash);
            if (!geohashCenter) return null; // geohashCenter가 없으면 아무것도 렌더링하지 않음

            return (
              <React.Fragment key={zone.geohash}>
                {/* 투명한 파란 원 렌더링 */}
                <Circle
                  center={{
                    latitude: geohashCenter.lat,
                    longitude: geohashCenter.lon,
                  }}
                  radius={75} // 반지름 75m
                  fillColor="rgba(0, 0, 255, 0.5)" // 파란색 투명
                  strokeColor="rgba(0, 0, 255, 1)" // 경계선 색상
                />
                {/* 중앙에 마커 추가 */}
                <Marker
                  coordinate={{
                    latitude: geohashCenter.lat,
                    longitude: geohashCenter.lon,
                  }}
                  pinColor="blue" // 마커 색상
                />
              </React.Fragment>
            );
          })}
        </>
      )}
    </>
  );
};

export default MungZoneHeatmap;
