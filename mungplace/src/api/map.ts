import { NearbyMarkersData } from '@/state/useMapStore';
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
    console.error('애견 동반 시설 조회 오류', error);
    throw error;
  }
};

const getNearbyMarkers = async (lat: number, lon: number): Promise<NearbyMarkersData> => {
  try {
    const params = {
      radius: 500,
      latitude: lat,
      longitude: lon,
      markerType: 'ALL',
    };

    const { data } = await axiosInstance.get('/markers', {
      headers: {
        'Content-Type': 'application/json; charset=utf8',
      },
      params,
    });
    return data;
  } catch (error) {
    console.error('애견 동반 시설 조회 오류', error);
    throw error;
  }
};

export { getWithPetPlace, getNearbyMarkers };
