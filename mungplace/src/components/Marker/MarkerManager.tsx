import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Button } from 'react-native'
import { useAppStore } from '@/state/useAppStore'; // 액세스 토큰을 가져오기 위한 스토어
import { MarkerData } from '@/state/useMapStore'; // Marker 인터페이스 가져오기
import axiosInstance from '@/api/axios';
import MapComponent from '../map/MapComponent'; // 맵 컴포넌트에 렌더링 할거임 ㅇㅇ

interface Marker extends MarkerData {
  createdAt : number // 시간 추가
}

const MarkerManager: React.FC = () => {
  const accessToken = useAppStore((state) => state.token);
  const [userMarkers, setUserMarkers] = useState<Marker[]>([]);
  const [nearbyMarkers, setNearbyMarkers] = useState<Record<string, any>>({});
  
  // 사용자의 마커 목록 조회
  const fetchUserMarkers = async () => {
    try {
      const response = await axiosInstance.get('/users/markers', {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        params: { size: 100 }, // 응답 받을 마커의 개수, 필요에 따라 조정 가능
      });
      setUserMarkers(response.data.markerInfos);
    } catch (error) {
      console.error('사용자 마커 조회 실패:', error);
    }
  };

  // 주변 마커 조회
  const fetchNearbyMarkers = async (latitude: number, longitude: number) => {
    try {
      const response = await axiosInstance.get('/markers', {
        headers: {
          'Content-Type': 'application/json',
        },
        data: {
          radius: 500, // 500미터 고정
          latitude,
          longitude,
          markerType: 'ALL', // BLUE | RED | ALL
        },
      });
      setNearbyMarkers(response.data.markersGroupedByGeohash);
    } catch (error) {
      console.error('주변 마커 조회 실패:', error);
    }
  };

  // 마커 삭제
  const deleteMarker = async (markerId: string) => {
    try {
      await axiosInstance.delete(`/markers/${markerId}`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
      });
      fetchUserMarkers(); // 마커 삭제 후 사용자 마커 목록 재조회
    } catch (error) {
      console.error('마커 삭제 실패:', error);
    }
  };

  useEffect(() => {
    fetchUserMarkers(); // 컴포넌트 마운트 시 사용자 마커 조회
    // 지도의 현재 위치를 가져와 주변 마커 조회 (예시로 임의의 좌표 사용)
    fetchNearbyMarkers(35.123456, 36.123456);
  }, []);

  return (
    <View style={{ padding: 16 }}>
      <Button title='내 마커 조회' onPress={fetchUserMarkers} /> 
      <FlatList
        data={userMarkers}
        keyExtractor={(marker) => marker.id}
        renderItem={({ item }) => (
          <View style={{ marginVertical: 8, padding: 8, borderWidth: 1, borderRadius: 4 }}>
            <Text style={{ fontSize: 18 }}>{item.title}</Text>
            <Text>{item.body}</Text>
            <Button title="삭제" onPress={() => deleteMarker(item.id)} />
          </View>
        )}
      />

      <MapComponent
        userMarkers={userMarkers}
        nearbyMarkers={nearbyMarkers}
      />
    </View>
  );
};

export default MarkerManager;
