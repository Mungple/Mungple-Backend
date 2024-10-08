  import React, { useEffect } from 'react';
  import { Marker, Circle } from 'react-native-maps';

  import { ToMungZone } from '@/types';
  import useUserLocation from '@/hooks/useUserLocation';

  type MungZoneHeatmapProps = {
    mungZone: Array<{lat : number; lon: number}> | null;
    checkMungPlace: (allUserZone: ToMungZone) => void;
  };

  type GeoZoneMarkerProps = {
    lat: number;
    lon: number;
  };

  const GeoZoneMarker = ({ lat, lon }: GeoZoneMarkerProps) => (
    <React.Fragment>
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
    const { userLocation } = useUserLocation();

    // 사용자 위치 변경 시 멍존 요청
    useEffect(() => {
      if (!userLocation) return;

      const zoneData: ToMungZone = {
        point: { lat: userLocation.latitude, lon: userLocation.longitude },
      };
      checkMungPlace(zoneData);
    }, [userLocation, checkMungPlace]);

    if (!mungZone) return null;

    return (
      <>
        {mungZone.map(({ lat, lon }, index) => {
        return <GeoZoneMarker key={index} lat={lat} lon={lon} />; // geohash를 더 이상 사용하지 않음
        })}
      </>
    );
  };

  export default MungZoneHeatmap;