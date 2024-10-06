import React from 'react';
import { Dimensions } from 'react-native';
import styled from 'styled-components/native';

import { colors } from '@/constants';
import CustomText from '../common/CustomText';

const deviceWidth = Dimensions.get('window').width;

const DayOfWeeks = () => {
  return (
    <Container>
      {['일', '월', '화', '수', '목', '금', '토'].map((dayOfWeek, i) => {
        return (
          <Item key={i}>
            <CustomText fontSize={18} color={dayOfWeek === '일' ? colors.RED.BASE : colors.BLACK}>
              {dayOfWeek}
            </CustomText>
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

export default DayOfWeeks;
