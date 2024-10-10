import axiosInstance from './axios';
import { FacilityPoints, PetFacilityDetail } from '@/types';

const getPetFacility = async (lat: number, lon: number): Promise<FacilityPoints> => {
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

const getPetFacilityDetail = async (facilityId: number): Promise<PetFacilityDetail> => {
  try {
    const { data } = await axiosInstance.get(`/pet-facilities/${facilityId}`, {
      headers: {
        'Content-Type': 'application/json; charset=utf8',
      },
    });
    return data;
  } catch (error) {
    console.error('[FAIL] getPetFacilityDetail :', error);
    throw error;
  }
};

export { getPetFacility, getPetFacilityDetail };
