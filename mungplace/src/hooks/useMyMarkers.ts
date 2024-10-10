import { useState } from 'react';
import axiosInstance from '@/api/axios';
import { useAppStore } from '@/state/useAppStore';
import { useMapStore } from '@/state/useMapStore';

const useMyMarkers = () => {
  const [loading, setLoading] = useState(true);
  const accessToken = useAppStore((state) => state.token);
  const myMarkers = useMapStore((state) => state.myMarkers)
  const setMyMarkers = useMapStore((state) => state.setMyMarkers) 

  const fetchMyMarkers = async () => {
    try {
      // 만약 기존에 마커가 있다면 마지막 마커의 markerId를 cursorId로 설정
      const cursorId = myMarkers.length > 0 ? myMarkers[myMarkers.length - 1].markerId : undefined;

      const params: { size: number; cursorId?: string } = { size: 50 };
      if (cursorId) {
        params.cursorId = cursorId
      }
      const response = await axiosInstance.get('/markers/users', {
        headers: {
          'Content-Type': 'application/json; charset=utf8',
          'Authorization': `Bearer ${accessToken}`,
        },
        params, // 파라미터 전송
      });

      // 응답받은 데이터를 기존 markers에 병합
      if (response.data  && Array.isArray(response.data) ) {
        const myMarkersData = Array.isArray(response.data) ? response.data : [response.data]
        setMyMarkers(myMarkersData); // 기존 마커 데이터와 병합
        console.log('훅 마커 데이터', myMarkersData)
      } else {
        console.error('응답 데이터가 예상과 다릅니다:', response.data);
      }
    } catch (error) {
      console.error('내 마커 조회 실패:', error);
    } finally {
      setLoading(false);
    }
  };

  return { myMarkers, fetchMyMarkers, loading };
};

export default useMyMarkers;
