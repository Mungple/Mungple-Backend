import { useState } from 'react';
import axiosInstance from '@/api/axios';
import { useAppStore } from '@/state/useAppStore';
import { useMapStore } from '@/state/useMapStore';
import  checkMyBlueZone  from '@/hooks/useWebsocketActions'

const useMyMarkers = () => {
  const [loading, setLoading] = useState(false);
  const accessToken = useAppStore((state) => state.token);
  const markers = useMapStore((state) => state.markers)
  const setMarkers = useMapStore((state) => state.setMarkers)

  const fetchMyMarkers = async () => {
    setLoading(true);
    try {
      // 만약 기존에 마커가 있다면 마지막 마커의 markerId를 cursorId로 설정
      const cursorId = markers.length > 0 ? markers[markers.length - 1].markerId : undefined;

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
      if (response.data && Array.isArray(response.data)) {
        const bluemarkers = response.filter(marker => marker.markerType === 'BLUE')

        setMarkers((prevMarkers) => [...prevMarkers, ...response.data]); // 기존 마커 데이터와 병합
        checkMyBlueZone()
      } else {
        console.error('응답 데이터가 예상과 다릅니다:', response.data);
      }
    } catch (error) {
      console.error('내 마커 조회 실패:', error);
    } finally {
      setLoading(false);
    }
  };

  // 블루존 셀 구성 함수
  const buildBlueZoneCells = (markers) => {
    const cellsMap = new Map(); // latitude와 longitude를 키로 사용

    markers.forEach(marker => {
      const key = `${marker.latitude},${marker.longitude}`;
      if (cellsMap.has(key)) {
        // 이미 존재하는 경우 weight 증가
        const existingCell = cellsMap.get(key);
        existingCell.weight += 1; // weight 증가
      } else {
        // 새 셀 추가
        cellsMap.set(key, {
          point: {
            latitude: marker.latitude,
            longitude: marker.longitude,
          },
          weight: 1, // 기본 weight 1
        });
      }
    });

    return Array.from(cellsMap.values()); // 맵을 배열로 변환
  };

  return { markers, fetchMyMarkers, loading, myBlueZone };
};

export default useMyMarkers;
