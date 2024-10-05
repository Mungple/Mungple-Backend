import React, { useState, useCallback } from 'react';
import { Text, ActivityIndicator } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import styled from 'styled-components/native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { getStatistics } from '@/api/walk';
import { colors } from '@/constants';
import { calculateTime, calculateDistance } from '@/utils/recordCalculator';

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

interface StatCardProps {
  icon: string;
  label: string;
  value: string;
}

const MonthStatistics: React.FC<{ year: number; month: number }> = ({ year, month }) => {
  const [statistics, setStatistics] = useState<Statistics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useFocusEffect(
    useCallback(() => {
      const getData = async () => {
        try {
          setLoading(true);
          const response = await getStatistics(year, month);
          const formattedStatistics = {
            ...response,
            totalTime: calculateTime(response.totalTime),
            totalDistance: calculateDistance(response.totalDistance),
            bestDistance: calculateDistance(response.bestDistance),
            bestTime: calculateTime(response.bestTime),
          };
          setStatistics(formattedStatistics);
          console.log(response);
        } catch (err) {
          if (err instanceof Error) {
            console.error(err);
            setError(err.message);
          } else {
            setError('산책 통계 기록을 불러오지 못했습니다.');
          }
        } finally {
          setLoading(false);
        }
      };

      getData();

      return () => {};
    }, [year, month]),
  );

  if (loading) {
    return (
      <LoadingContainer>
        <ActivityIndicator size="large" color={colors.ORANGE.BASE} />
      </LoadingContainer>
    );
  }

  if (error) {
    return (
      <ErrorContainer>
        <Text>{error}</Text>
      </ErrorContainer>
    );
  }

  return (
    <Container>
      <StyledHeader>
        <StyledHeaderText>월간 통계</StyledHeaderText>
      </StyledHeader>
      <StatCard icon="explore" label="총 산책 횟수" value={`${statistics?.totalExplorations} 회`} />
      <StatCard icon="timer" label="총 산책 시간" value={`${statistics?.totalTime}`} />
      <StatCard icon="track-changes" label="총 산책 거리" value={`${statistics?.totalDistance}`} />
      <StatCard icon="today" label="가장 오래 걸은 날" value={`${statistics?.bestTimeDay} 일`} />
      <StatCard
        icon="date-range"
        label="가장 많이 걸은 날"
        value={`${statistics?.bestDistanceDay} 일`}
      />
      <StatCard icon="access-time" label="가장 오래 걸은 시간" value={`${statistics?.bestTime}`} />
      <StatCard
        icon="directions-walk"
        label="가장 많이 걸은 거리"
        value={`${statistics?.bestDistance}`}
      />
    </Container>
  );
};

const StatCard: React.FC<StatCardProps> = ({ icon, label, value }) => (
  <Card>
    <CardContent>
      <StatIcon>
        <MaterialIcons name={icon} size={28} color={colors.ORANGE.BASE} />
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
  background-color: ${colors.WHITE};
`;

const Card = styled.View`
  background-color: white;
  border-radius: 10px;
  padding: 15px;
  margin-bottom: 10px;
`;

const CardContent = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

const StatIcon = styled.View`
  margin-right: 10px;
`;

const StatLabel = styled.Text`
  font-weight: bold;
  font-size: 16px;
  color: ${colors.BLACK};
  flex: 1;
`;

const StatValue = styled.Text`
  font-size: 18px;
  font-weight: 500;
  color: ${colors.BLACK};
`;

const StyledHeader = styled.View`
  padding-left: 20px;
  padding-top: 12px;
  padding-bottom: 12px;
  border-bottom-width: 1px;
  border-bottom-color: ${colors.GRAY_100};
`;

const StyledHeaderText = styled.Text`
  font-size: 16px;
  font-weight: bold;
  color: ${colors.BLACK};
`;

export default MonthStatistics;
