import { useState } from 'react';
import { useMapStore } from '@/state/useMapStore';
import { getMyMarkers } from '@/api';

const useMyMarkers = () => {
  const [loading, setLoading] = useState(false);
  const myMarkers = useMapStore((state) => state.myMarkers);
  const setMyMarkers = useMapStore((state) => state.setMyMarkers);

  const fetchMyMarkers = async () => {
    setLoading(true);

    try {
      // 만약 기존에 마커가 있다면 마지막 마커의 markerId를 cursorId로 설정
      const cursorId = myMarkers.length > 0 ? myMarkers[myMarkers.length - 1].markerId : null;
      const data = await getMyMarkers(cursorId);

      setMyMarkers(Array.isArray(data) ? data : [data]);
    } catch (error) {
      console.error('내 마커 조회 실패:', error);
    } finally {
      setLoading(false);
    }
  };

  return { myMarkers, fetchMyMarkers, loading };
};

export default useMyMarkers;
