import React, { useEffect, useState, useCallback } from 'react';
import { Heatmap } from 'react-native-maps';
import useUserLocation from '@/hooks/useUserLocation';
import { useMapStore } from '@/state/useMapStore';
import  useWebsocketActions  from '@/hooks/useWebsocketActions'
import useWebSocket from '@/hooks/useWebsocket';


interface MyBlueZoneCell {
  point: {
    lat: number;
    lon: number;
  };
  weight: number;
}

interface ToZone {
  side: number;
  point: {
    lat: number;
    lon: number;
  };
}

const MyBlueZoneHeatmap = () => {
  const { userLocation } = useUserLocation(); // 사용자 위치 가져오기
  const [myBlueZone, setMyBlueZone] = useState<{ cells: MyBlueZoneCell[] } | null>(null);
  const { checkMyBlueZone } = useWebsocketActions()
  const visibleElements = useState(true)
  const {clientSocket} = useWebSocket()

  // 소켓에서 블루존 데이터 수신 핸들러
  const handleBlueZoneData = useCallback((blueZoneData: { cells: MyBlueZoneCell[] }) => {
    console.log("수신한 블루존 데이터:", blueZoneData);
    setMyBlueZone(blueZoneData);
  }, []);

  // 사용자 위치 변경 시 블루존 요청
  useEffect(() => {
    if (userLocation) {
      const centerLat = userLocation.latitude;
      const centerLon = userLocation.longitude;

      // 반경 1000미터 내 블루존 요청
      const zoneData: ToZone = {
        side: 1000,
        point: { lat: centerLat, lon: centerLon },
      };

      checkMyBlueZone(zoneData);
    }
  }, [userLocation, checkMyBlueZone]);

  // 블루존 데이터 수신을 위한 소켓 구독
  useEffect(() => {
    console.log("소켓 연결 상태:", clientSocket?.connected);
    if (clientSocket?.connected) {
      console.log("소켓 구독 시작")
      const subscription = clientSocket.subscribe('/user/sub/users/bluezone', (message) => {
        console.log("수신한 메시지:", message.body)
        const blueZoneData = JSON.parse(message.body);
        handleBlueZoneData(blueZoneData); // 수신한 데이터로 상태 업데이트
      });

      console.log("블루존 데이터 구독 요청 완료"); 
      // 컴포넌트 언마운트 시 구독 해제
      return () => {
        console.log("구독해제")
        subscription.unsubscribe();
      };
    } else {
      console.log("소켓이 연결되지않음")
    }
  }, [clientSocket, handleBlueZoneData]);

  return (
    <>
      {/* 개인 블루존 히트맵 렌더링 */}
      {visibleElements && myBlueZone && myBlueZone.cells.length > 0 && (
        <Heatmap
          points={myBlueZone.cells.map((cell) => ({
            latitude: cell.point.lat,
            longitude: cell.point.lon,
            weight: cell.weight,
          }))}
        />
      )}
    </>
  );
};

export default MyBlueZoneHeatmap;