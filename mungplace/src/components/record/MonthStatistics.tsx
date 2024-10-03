import React, { useState, useCallback } from 'react';
import { Text, ActivityIndicator, ScrollView } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import styled from 'styled-components/native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { colors } from '@/constants';
import { DEVICE_WIDTH } from '@/constants/device';
import { getStatistics } from '@/api/walk';

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

const ICON_SIZE = DEVICE_WIDTH * 0.1;
const FONT_SIZE = DEVICE_WIDTH * 0.04;

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
          setStatistics(response);
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
        <ActivityIndicator />
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
    <ScrollView>
      <Container>
        <Footer>
          <FooterText>월간 통계</FooterText>
        </Footer>
        <StatCard
          icon="explore"
          label="총 산책 횟수"
          value={`${statistics?.totalExplorations} 회`}
        />
        <StatCard
          icon="track-changes"
          label="총 산책 거리"
          value={`${statistics?.totalDistance} km`}
        />
        <StatCard icon="timer" label="총 산책 시간" value={`${statistics?.totalTime} 분`} />
        <StatCard
          icon="directions-walk"
          label="가장 많이 걸은 거리"
          value={`${statistics?.bestDistance} km`}
        />
        <StatCard
          icon="access-time"
          label="가장 오래 걸은 시간"
          value={`${statistics?.bestTime} `}
        />
        <StatCard icon="today" label="가장 오래 걸은 날" value={`${statistics?.bestTimeDay} 일`} />
        <StatCard
          icon="date-range"
          label="가장 많이 걸은 날"
          value={`${statistics?.bestDistanceDay} 일`}
        />
      </Container>
    </ScrollView>
  );
};

const StatCard: React.FC<StatCardProps> = ({ icon, label, value }) => (
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

const Footer = styled.View`
  padding-left: 20px;
  padding-top: 12px;
  padding-bottom: 12px;
  border-bottom-width: 1px;
  border-bottom-color: ${colors.GRAY_100};
`;

const FooterText = styled.Text`
  font-size: 18px;
  font-weight: bold;
  color: ${colors.BLACK};
`;

export default MonthStatistics;
