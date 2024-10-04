import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import axiosInstance from '@/api/axios';
import { useRoute } from '@react-navigation/native';
import { useAppStore } from '@/state/useAppStore';

interface Facility {
  id: number;
  name: string;
  address: string;
  phone: string;
  homepage: string;
  closedDays: string;
  businessHours: string;
  description: string;
}

const FacilityDetailScreen = () => {
  const route = useRoute();
  const { facilityId } = route.params; // facilityId를 route.params에서 가져옴
  const [facility, setFacility] = useState<Facility | null>(null)
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const accessToken = useAppStore((state) => state.token)

  // 시설 상세 정보 조회 함수
  const fetchFacilityDetails = async () => {
    try {
      const response = await axiosInstance.get(`/pet-facilities/${facilityId}`, {
        headers: {
          'Content-Type': 'application/json; charset=utf8',
          'Authorization': `Bearer ${accessToken}`, // accessToken 변수를 적절히 가져와야 함
        },
      });
      setFacility(response.data);
    } catch (err) {
      setError(err);
      console.error("상세 정보 조회 오류", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFacilityDetails();
  }, [facilityId]);

  if (loading) {
    return <Text>Loading...</Text>; // 로딩 중인 경우
  }

  if (error) {
    return <Text>오류 발생: {error.message}</Text>; // 오류가 발생한 경우
  }

  return (
    <View>
      <Text>{facility?.name ?? '시설 이름이 없습니다.'}</Text>
      <Text>{facility?.address ?? '주소가 없습니다.'}</Text>
      <Text>{facility?.phone ?? '전화번호가 없습니다.'}</Text>
      <Text>{facility?.homepage ?? '홈페이지 정보가 없습니다.'}</Text>
      <Text>{facility?.closedDays ?? '휴무일 정보가 없습니다.'}</Text>
      <Text>{facility?.businessHours ?? '영업시간 정보가 없습니다.'}</Text>
      <Text>{facility?.description ?? '설명 정보가 없습니다.'}</Text>
    </View>
  );
};

export default FacilityDetailScreen;
