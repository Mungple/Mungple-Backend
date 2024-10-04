import React, { useEffect, useState } from 'react';
import { Text, ActivityIndicator } from 'react-native';
import styled from 'styled-components/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RecordStackParamList } from '@/navigations/stack/RecordStackNavigator';
import { getWalkDetail } from '@/api/walk'; // API 호출 함수 가져오기

type DayWalksDetailProps = NativeStackScreenProps<RecordStackParamList, 'WalkDetail'>;

const DayWalksDetail: React.FC<DayWalksDetailProps> = ({ route }) => {
  const { explorationId } = route.params; // 선택한 산책의 ID
  const [walkDetail, setWalkDetail] = useState<any>(null); // 산책 세부 정보 상태
  const [loading, setLoading] = useState(true); // 로딩 상태

  // 산책 상세 정보 가져오기
  useEffect(() => {
    const fetchWalkDetail = async () => {
      try {
        const detail = await getWalkDetail(explorationId); // API 호출
        setWalkDetail(detail); // 상태 업데이트
      } catch (error) {
        console.error('산책 상세 정보 가져오기 실패:', error);
      } finally {
        setLoading(false); // 로딩 완료
      }
    };

    fetchWalkDetail(); // 호출 실행
  }, [explorationId]);

  if (loading) {
    return (
      <LoadingContainer>
        <ActivityIndicator size="large" color="#0000ff" />
      </LoadingContainer>
    );
  }

  if (!walkDetail) {
    return <Text>산책 정보를 찾을 수 없습니다.</Text>; // 에러 처리
  }

  return (
    <Container>
      <DetailText>산책 거리: {walkDetail.distance} 미터</DetailText>
      {/* <DetailText>함께한 개 ID: {walkDetail.togetherDogIds.join(', ')}</DetailText> */}
      <DetailText>시작 시간: {walkDetail.startTime}</DetailText>
      <DetailText>종료 시간: {walkDetail.endTime}</DetailText>
    </Container>
  );
};

const LoadingContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
`;

const Container = styled.View`
  padding: 20px;
`;

const DetailText = styled.Text`
  font-size: 18px;
  margin-bottom: 5px;
`;

export default DayWalksDetail;
