import React from 'react';
import {Dimensions} from 'react-native';
import styled from 'styled-components/native';

import {colors} from '@/constants';

const deviceWidth = Dimensions.get('window').width;

const DayOfWeeks = () => {
  return (
    <Container>
      {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((dayOfWeek, i) => {
        return (
          <Item key={i}>
            <DayText>{dayOfWeek}</DayText>
          </Item>
        );
      })}
    </Container>
  );
};

const Container = styled.View`
  flex-direction: row;
  margin-bottom: 5px;
`;

const Item = styled.View`
  width: ${deviceWidth / 7}px;
  align-items: center;
`;

const DayText = styled.Text`
  font-size: 13px;
  color: ${colors.BLACK};
`;

export default DayOfWeeks;
