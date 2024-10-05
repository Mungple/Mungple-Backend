import React from 'react';
import { Dimensions } from 'react-native';
import styled from 'styled-components/native';

import { colors } from '@/constants';

const deviceWidth = Dimensions.get('window').width;

const DayOfWeeks = () => {
  return (
    <Container>
      {['일', '월', '화', '수', '목', '금', '토'].map((dayOfWeek, i) => {
        return (
          <Item key={i}>
            <DayText isSunday={dayOfWeek === '일'}>{dayOfWeek}</DayText>
          </Item>
        );
      })}
    </Container>
  );
};

const Container = styled.View`
  flex-direction: row;
  margin-bottom: 5px;
  padding-bottom: 5px;
`;

const Item = styled.View`
  width: ${deviceWidth / 7}px;
  align-items: center;
`;

const DayText = styled.Text<{ isSunday: boolean }>`
  font-size: ${deviceWidth * 0.04}px;
  color: ${colors.BLACK};
  font-weight: bold;
  color: ${({ isSunday }) => (isSunday ? 'red' : colors.GRAY_500)};
`;

export default DayOfWeeks;
