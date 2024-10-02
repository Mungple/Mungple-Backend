import {useEffect, useState} from 'react'
import {LatLng} from 'react-native-maps'
import GeoLocation from '@react-native-community/geolocation'
import useAppState from './useAppState'
// import {useMapStore} from '@/state/useMapStore';

// 사용자 위치를 추적하고 관련 작업을 수행
const useUserLocation = (): {userLocation: LatLng; isUserLocationError: boolean} => {
  // const {fetchPersonalBlueZone, fetchGlobalBlueZone} = useMapStore();

  const [userLocation, setUserLocation] = useState<LatLng>({
    latitude: 35.096406,
    longitude: 128.853919,
  })
  const [isUserLocationError, setIsUserLocationError] = useState(false)
  const {isComeback} = useAppState()

  useEffect(() => {
    const getLocation = () => {
      GeoLocation.getCurrentPosition(
        info => {
          const {latitude, longitude} = info.coords
          // fetchPersonalBlueZone(latitude, longitude);
          // fetchGlobalBlueZone(latitude, longitude);
          setUserLocation({latitude, longitude})
          setIsUserLocationError(false)
        },
        () => {
          setIsUserLocationError(true)
        },
        {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 10000,
        },
      )
    }

    // 처음 위치를 가져오기
    getLocation()

    // 5초마다 위치 갱신
    const intervalId = setInterval(getLocation, 5000)

    // 컴포넌트가 언마운트되면 interval을 정리합니다
    return () => {
      clearInterval(intervalId)
    }
  }, [isComeback])

  return {userLocation, isUserLocationError}
}

export default useUserLocation
