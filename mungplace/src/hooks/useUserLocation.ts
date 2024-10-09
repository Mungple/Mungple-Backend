import { useEffect } from 'react';
import GeoLocation from '@react-native-community/geolocation';

import useAppState from './useAppState';
import { useUserStore } from '@/state/useUserStore';

// 사용자 위치를 추적하고 관련 작업을 수행
const useUserLocation = () => {
  const setUserLocation = useUserStore((state) => state.setUserLocation);
  const { isComeback } = useAppState();

  useEffect(() => {
    const getLocation = () => {
      GeoLocation.getCurrentPosition(
        (info) => {
          const { latitude, longitude } = info.coords;
          setUserLocation({ latitude, longitude });
        },
        () => {
          setUserLocation(null);
        },
        {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 10000,
        },
      );
    };

    // 처음 위치를 가져오기
    getLocation();

    // 5초마다 위치 갱신
    const intervalId = setInterval(getLocation, 5000);

    // 컴포넌트가 언마운트되면 interval을 정리합니다
    return () => {
      clearInterval(intervalId);
    };
  }, [isComeback]);
};

export default useUserLocation;
