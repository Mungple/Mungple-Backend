import {useEffect, useState} from 'react';
import {LatLng} from 'react-native-maps';
import GeoLocation from '@react-native-community/geolocation';
import useAppState from './useAppState';
import {useMapStore} from '@/state/useMapStore';

// 사용자 위치를 추적하고 관련 작업을 수행
const useUserLocation = (): {userLocation: LatLng; isUserLocationError: boolean} => {
  const {fetchPersonalBlueZone, fetchGlobalBlueZone} = useMapStore();

  const [userLocation, setUserLocation] = useState<LatLng>({
    latitude: 35.096406,
    longitude: 128.853919,
  });
  const [isUserLocationError, setIsUserLocationError] = useState(false);
  const {isComeback} = useAppState();

  useEffect(() => {
    GeoLocation.getCurrentPosition(
      info => {
        const {latitude, longitude} = info.coords;
        // console.log('User Location:', { latitude, longitude });
        fetchPersonalBlueZone(latitude, longitude);
        fetchGlobalBlueZone(latitude, longitude);
        setUserLocation({latitude, longitude});
        setIsUserLocationError(false);
      },
      () => {
        // console.error('Location Error:', error);
        setIsUserLocationError(true);
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 10000,
      },
    );
  }, [isComeback]);

  return {userLocation, isUserLocationError};
}

export default useUserLocation;
