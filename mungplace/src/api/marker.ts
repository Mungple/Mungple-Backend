import { MarkerDetails, MarkerId, MyMarkerData, NearbyMarkersData } from '@/types';
import axiosInstance from './axios';

const createMarker = async (formData: FormData): Promise<MarkerId> => {
  try {
    const { data } = await axiosInstance.post('/markers', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return data;
  } catch (error) {
    console.error('[FAIL] postMarker :', error);
    throw error;
  }
};

const deleteMarker = async (markerId: string): Promise<number> => {
  try {
    const { status } = await axiosInstance.delete(`/markers/${markerId}`, {
      headers: {
        'Content-Type': 'application/json; charset=utf8',
      },
    });
    return status;
  } catch (error) {
    console.error('[FAIL] deleteMarker :', error);
    throw error;
  }
};

const getMyMarkers = async ( cursorId: string | null ): Promise<MyMarkerData[]> => {
  try {
    const params: { size: number, cursorId? : string } = { size : 50}
    if (cursorId) {
      params.cursorId = cursorId
    }

    const { data } = await axiosInstance.get('/markers/users', {
      headers: {
        'Content-Type': 'application/json; charset=utf8',
      },
      params,
    });
    console.log('내 마커 정보 겟', data)
    return data;
  } catch (error) {
    console.error('[FAIL] getMyMarkers :', error);
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
    console.error('[FAIL] getNearbyMarkers :', error);
    throw error;
  }
};

const getMarkerDetails = async (markerId: string): Promise<MarkerDetails> => {
  try {
    const { data } = await axiosInstance.get(`/markers/${markerId}`, {
      headers: {
        'Content-Type': 'application/json; charset=utf8',
      },
    });
    return data;
  } catch (error) {
    console.error('[FAIL] getMarkerDetails :', error);
    throw error;
  }
};

export { createMarker, deleteMarker, getMyMarkers, getNearbyMarkers, getMarkerDetails };
