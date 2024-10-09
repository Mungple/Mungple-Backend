import axiosInstance from './axios';
import { FacilityPoints } from '@/types';

const getWithPetPlace = async (lat: number, lon: number): Promise<FacilityPoints> => {
  try {
    const params = {
      radius: 1000,
      'point.lat': lat,
      'point.lon': lon,
    };

    const { data } = await axiosInstance.get('/pet-facilities', {
      headers: {
        'Content-Type': 'application/json; charset=utf8',
      },
      params,
    });
    return data;
  } catch (error) {
    console.error('[FAIL] getWithPetPlace :', error);
    throw error;
  }
};

export { getWithPetPlace };
