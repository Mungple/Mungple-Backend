import axiosInstance from '@/api/axios';
import { useEffect } from 'react';
import useUserLocation from '@/hooks/useUserLocation';
import { useAppStore } from '@/state/useAppStore';
import { PetFacility } from '@/types';

interface WithPetPlaceProps {
  setPetFacilities: React.Dispatch<React.SetStateAction<PetFacility[]>>;
}

const WithPetPlace = ({ setPetFacilities }: WithPetPlaceProps) => {
  const { userLocation } = useUserLocation();
  const radius = 1000;
  const latitude = userLocation.latitude;
  const longitude = userLocation.longitude;
  const accessToken = useAppStore((state) => state.token);

  const fetchWithPetPlace = async () => {
    const url = `/pet-facilities?radius=${radius}&point.lat=${latitude}&point.lon=${longitude}`;
    try {
      const response = await axiosInstance.get(url, {
        headers: {
          'Content-Type': 'application/json; charset=utf8',
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const facilities = response.data.facilityPoints.map((facility: PetFacility) => ({
        id: facility.id,
        latitude: facility.point.lat, // 응답 데이터에서 위도
        longitude: facility.point.lon, // 응답 데이터에서 경도
      }));
      setPetFacilities(facilities);
    } catch (error) {
      console.error('애견 동반 시설 조회 오류', error);
    }
  };

  useEffect(() => {
    if (latitude && longitude) {
      fetchWithPetPlace();
    }
  }, [latitude, longitude]);

  return null;
};

export default WithPetPlace;
