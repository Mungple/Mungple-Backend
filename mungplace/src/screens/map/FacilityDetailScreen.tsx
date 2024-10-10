import React, { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import CustomText from '@/components/common/CustomText';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import { PetFacilityDetail } from '@/types';
import { getPetFacilityDetail } from '@/api';
import CustomButton from '@/components/common/CustomButton';

const FacilityDetailScreen: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { facilityId } = route.params as { facilityId: number }; // facilityId를 route.params에서 가져옴
  const [facility, setFacility] = useState<PetFacilityDetail | null>(null);
  const [loading, setLoading] = useState(true);

  // 시설 상세 정보 조회 함수
  const fetchFacilityDetails = async () => {
    try {
      setFacility(await getPetFacilityDetail(facilityId));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFacilityDetails();
  }, [facilityId]);

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <View style={styles.container}>
      <CustomText style={styles.title}>{facility?.name ?? '시설 이름이 없습니다.'}</CustomText>
      <CustomText style={styles.text}>{facility?.address ?? '주소가 없습니다.'}</CustomText>
      <CustomText style={styles.text}>{facility?.phone ?? '전화번호가 없습니다.'}</CustomText>
      <CustomText style={styles.text}>
        {facility?.homepage ?? '홈페이지 정보가 없습니다.'}
      </CustomText>
      <CustomText style={styles.text}>
        {facility?.closedDays ?? '휴무일 정보가 없습니다.'}
      </CustomText>
      <CustomText style={styles.text}>
        {facility?.businessHours ?? '영업시간 정보가 없습니다.'}
      </CustomText>
      <CustomText style={styles.description}>
        {facility?.description ?? '설명 정보가 없습니다.'}
      </CustomText>
      <CustomButton label="뒤로 가기" onPress={() => navigation.goBack()} variant="outlined" 
        style={{ position: 'absolute', bottom: 30, left: 20 }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 15,
    padding: 20,
    backgroundColor: '#fff', // 밝은 배경색
    borderRadius: 10,
    shadowColor: '#000', // 그림자 추가
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    margin: 20,
  },
  content: {
    flexGrow: 1,
    justifyContent: 'flex-start',
  },
  title: {
    fontSize: 20,
    marginBottom: 10,
  },
  text: {
    fontSize: 16,
    color: 'gray',
    marginBottom: 5,
  },
  description: {
    fontSize: 16,
    color: 'black',
    marginTop: 10,
    marginBottom: 20,
    lineHeight: 22,
  },
});

export default FacilityDetailScreen;
