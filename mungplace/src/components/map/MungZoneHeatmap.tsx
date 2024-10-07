import React, { useEffect } from 'react';
import { Marker, Circle } from 'react-native-maps';

import { ToMungZone } from '@/types';
import { useMapStore } from '@/state/useMapStore';
import { useUserStore } from '@/state/useUserStore';

type MungZoneHeatmapProps = {
  mungZone: Array<{ geohash: string }> | null;
  checkMungPlace: (allUserZone: ToMungZone) => void;
};

type GeoZoneMarkerProps = {
  lat: number;
  lon: number;
  geohash: string;
};

const GeoZoneMarker = ({ lat, lon, geohash }: GeoZoneMarkerProps) => (
  <React.Fragment key={geohash}>
    <Circle
      center={{ latitude: lat, longitude: lon }}
      radius={75}
      fillColor="rgba(0, 0, 255, 0.5)"
      strokeColor="rgba(0, 0, 255, 1)"
    />
    <Marker coordinate={{ latitude: lat, longitude: lon }} pinColor="blue" />
  </React.Fragment>
);

const MungZoneHeatmap = ({ mungZone, checkMungPlace }: MungZoneHeatmapProps) => {
  const userLocation = useUserStore((state) => state.userLocation);
  const getGeohashCenter = useMapStore((state) => state.getGeohashCenter);

  // 사용자 위치 변경 시 블루존 요청
  useEffect(() => {
    if (!userLocation) return;

    const zoneData: ToMungZone = { point: { lat: userLocation.lat, lon: userLocation.lon } };
    checkMungPlace(zoneData);
  }, [userLocation, checkMungPlace]);

  if (!mungZone) return null;

  return (
    <>
      {mungZone.map(({ geohash }) => {
        const geohashCenter = getGeohashCenter(geohash);
        if (!geohashCenter) return null;

        const { lat, lon } = geohashCenter;

        return <GeoZoneMarker key={geohash} lat={lat} lon={lon} geohash={geohash} />;
      })}
    </>
  );
};

export default MungZoneHeatmap;
