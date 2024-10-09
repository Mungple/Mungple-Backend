import React, { useEffect, useState } from 'react';
import { ActivityIndicator } from 'react-native';
import styled from 'styled-components/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RecordStackParamList } from '@/navigations/stack/RecordStackNavigator';
import { getWalkDetail } from '@/api/walk';
import { colors } from '@/constants';
import WalkDetail from '@/components/record/WalkDetail';
import CustomText from '@/components/common/CustomText';
import WalkDogs from '@/components/record/WalkDogs';
import WalkMap from '@/components/record/WalkMap';
import { Point } from '@/types';

type DayWalksDetailProps = NativeStackScreenProps<RecordStackParamList, 'WalkDetail'>;

interface WalkDetailData {
  distance: number;
  endTime: string;
  explorationId: number;
  points: Point[] | null;
  startTime: string;
  togetherDogIds: number[];
}

const DayWalksDetail: React.FC<DayWalksDetailProps> = ({ route }) => {
  const { explorationId } = route.params;
  const [walkDetail, setWalkDetail] = useState<WalkDetailData | null>(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWalkDetail = async () => {
      try {
        const detail = await getWalkDetail(explorationId);
        setWalkDetail(detail);
      } catch (error) {
        console.error('산책 상세 정보 가져오기 실패:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchWalkDetail();
  }, [explorationId]);

  if (loading) {
    return (
      <LoadingContainer>
        <ActivityIndicator size="large" color="#0000ff" />
      </LoadingContainer>
    );
  }

  if (!walkDetail) {
    return <CustomText>산책 정보를 찾을 수 없습니다.</CustomText>;
  }

  if (!walkDetail.points || walkDetail.points.length === 0) {
    return <CustomText>산책 포인트가 없습니다.</CustomText>;
  }

  const latLngPoints: { latitude: number; longitude: number }[] = walkDetail.points.map(
    (point) => ({
      latitude: point.lat,
      longitude: point.lon,
    }),
  );

  return (
    <Container>
      <WalkMap points={latLngPoints} />
      <WalkDogs togetherDogIds={walkDetail.togetherDogIds} />
      <WalkDetail
        distance={walkDetail.distance}
        endTime={walkDetail.endTime}
        startTime={walkDetail.startTime}
      />
    </Container>
  );
};

const LoadingContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
`;

const Container = styled.SafeAreaView`
  flex: 1;
  background-color: ${colors.WHITE};
`;

export default DayWalksDetail;
