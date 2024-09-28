import React, {useState, useEffect, useCallback} from 'react';
import {View, Text, ActivityIndicator, ScrollView} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';
import styled from 'styled-components/native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {DEVICE_WIDTH} from '@/constants/device';
import {getStatistics} from '@/api/walk';

interface Statistics {
  year: number;
  month: number;
  totalExplorations: number;
  totalTime: number;
  totalDistance: number;
  bestDistanceDay: number;
  bestDistance: number;
  bestTimeDay: number;
  bestTime: number;
}

const ICON_SIZE = DEVICE_WIDTH * 0.1;
const FONT_SIZE = DEVICE_WIDTH * 0.04;

const MonthStatistics = () => {
  const [statistics, setStatistics] = useState<Statistics | null>(null);
  const [loading, setLoading] = useState(true); // 로딩 상태 추가
  const [error, setError] = useState<string | null>(null); // 에러 상태 추가

  useFocusEffect(
    useCallback(() => {
      const getData = async () => {
        try {
          setLoading(true); // 로딩 상태 시작
          const response = await getStatistics(2024, 9); // year와 month를 props로 받음
          setStatistics(response);
          console.log(response);
        } catch (err) {
          console.error(err);
          setError(err.message || '통계 조회에 실패했습니다.'); // 에러 메시지 설정
        } finally {
          setLoading(false); // 로딩 상태 종료
        }
      };

      getData();

      // Clean up function if needed
      return () => {
        // 필요한 경우 리소스를 정리하는 코드
      };
    }, []), // year와 month가 변경될 때마다 호출
  );

  if (loading) {
    return (
      <LoadingContainer>
        <ActivityIndicator size="large" color="#0000ff" />
      </LoadingContainer>
    );
  }

  if (error) {
    return (
      <ErrorContainer>
        <Text>통계 기록을 불러오지 못했습니다.</Text>
      </ErrorContainer>
    );
  }

  return (
    <ScrollView>
      <Container>
        <StatCard
          icon="track-changes"
          label="산책 거리"
          value={`${statistics?.totalDistance} km`}
        />
        <StatCard
          icon="timer"
          label="산책 시간"
          value={`${statistics?.totalTime} 분`}
        />
        <StatCard
          icon="directions-walk"
          label="?"
          value={`${statistics?.bestDistance} km`}
        />
        <StatCard
          icon="access-time"
          label="?"
          value={`${statistics?.bestTime} `}
        />
        <StatCard
          icon="today"
          label="?"
          value={`${statistics?.bestTimeDay} 회`}
        />
        <StatCard
          icon="date-range"
          label="?"
          value={`${statistics?.bestDistanceDay} 회`}
        />
        <StatCard
          icon="explore"
          label="산책 횟수"
          value={`${statistics?.totalExplorations} 회`}
        />
      </Container>
    </ScrollView>
  );
};

const StatCard = ({icon, label, value}) => (
  <Card>
    <CardContent>
      <StatIcon>
        <MaterialIcons name={icon} size={ICON_SIZE} />
      </StatIcon>
      <StatLabel>{label}</StatLabel>
      <StatValue>{value}</StatValue>
    </CardContent>
  </Card>
);

const LoadingContainer = styled.View`
  align-items: center;
  justify-content: center;
  height: 100px;
`;

const ErrorContainer = styled.View`
  align-items: center;
  justify-content: center;
  height: 100px;
`;

const Container = styled.View`
  padding: 10px;
`;

const Card = styled.View`
  background-color: white;
  border-radius: 10px;
  padding: 15px;
  margin-bottom: 5px;
  elevation: 1;
`;

const CardContent = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

const StatIcon = styled.View`
  margin-right: 2%;
`;

const StatLabel = styled.Text`
  font-size: ${FONT_SIZE}px;
  flex: 1;
`;

const StatValue = styled.Text`
  font-size: ${FONT_SIZE}px;
  font-weight: bold;
`;

export default MonthStatistics;
