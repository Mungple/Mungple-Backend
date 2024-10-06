import { useEffect } from 'react';

import { PetFacility } from '@/types';
import axiosInstance from '@/api/axios';
import { useAppStore } from '@/state/useAppStore';
import useUserLocation from '@/hooks/useUserLocation';

interface WithPetPlaceProps {
  setPetFacilities: React.Dispatch<React.SetStateAction<PetFacility[]>>;
}

const WithPetPlace = ({ setPetFacilities }: WithPetPlaceProps) => {
  const { userLocation } = useUserLocation();
  const accessToken = useAppStore((state) => state.token);

  const fetchWithPetPlace = async (lat: number, lon: number) => {
    const url = `/pet-facilities?radius=1000&point.lat=${lat}&point.lon=${lon}`;
    try {
      const response = await axiosInstance.get(url, {
        headers: {
          'Content-Type': 'application/json; charset=utf8',
          Authorization: `Bearer ${accessToken}`,
        },
      });

      setPetFacilities(response.data);
    } catch (error) {
      console.error('애견 동반 시설 조회 오류', error);
    }
  };

  useEffect(() => {
    const { latitude, longitude } = userLocation;
    if (latitude && longitude) {
      fetchWithPetPlace(latitude, longitude);
    }
  }, [userLocation]);

  return null;
};

export default WithPetPlace;
