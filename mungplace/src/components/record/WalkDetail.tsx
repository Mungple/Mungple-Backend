import React from 'react';
import styled from 'styled-components/native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { colors } from '@/constants';
import { calculateDuration, calculateDistance, processDateToTime } from '@/utils/recordCalculator';
import CustomText from '../common/CustomText';

interface WalkDetailProps {
  distance: number;
  endTime: string;
  startTime: string;
}

interface StatCardProps {
  icon: string;
  label: string;
  value: string;
}

const WalkDetail: React.FC<WalkDetailProps> = ({ distance, endTime, startTime }) => {
  return (
    <Container>
      <StyledHeader>
        <CustomText fontWeight="bold" fontSize={16}>
          상세 정보
        </CustomText>
      </StyledHeader>
      <StatCard icon="directions-walk" label="거리" value={calculateDistance(distance)} />
      <StatCard icon="access-time" label="시작 시간" value={processDateToTime(startTime)} />
      <StatCard icon="alarm" label="종료 시간" value={processDateToTime(endTime)} />
      <StatCard icon="timer" label="소요 시간" value={calculateDuration(startTime, endTime)} />
    </Container>
  );
};

const StatCard: React.FC<StatCardProps> = ({ icon, label, value }) => (
  <Card>
    <CardContent>
      <StatIcon>
        <MaterialIcons name={icon} size={36} color={colors.ORANGE.BASE} />
      </StatIcon>
      <CustomText fontWeight="bold" fontSize={18} style={{ flex: 1 }}>
        {label}
      </CustomText>
      <CustomText fontSize={20}>{value}</CustomText>
    </CardContent>
  </Card>
);

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
  margin-right: 8px;
`;

const StyledHeader = styled.View`
  padding-left: 20px;
  padding-top: 12px;
  padding-bottom: 12px;
  border-bottom-width: 1px;
  border-bottom-color: ${colors.GRAY_100};
`;

export default WalkDetail;
