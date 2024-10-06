import React from 'react';
import { Dimensions, Image, StyleSheet } from 'react-native';
import styled from 'styled-components/native';

import { colors } from '@/constants';
import paw from '@/assets/paw.png';
import CustomText from '../common/CustomText';

interface DateBoxProps {
  date: number;
  isToday: boolean;
  selectedDate: number;
  hasAttendance: boolean;
  onPressDate: (date: number) => void;
}

const deviceWidth = Dimensions.get('window').width;

const DateBox = ({ date, isToday, selectedDate, hasAttendance, onPressDate }: DateBoxProps) => {
  const handlePress = () => {
    if (hasAttendance) {
      onPressDate(date);
    }
  };

  return (
    <DatePressable isSelected={selectedDate === date} onPress={handlePress}>
      {date > 0 && (
        <>
          <DateContainer isToday={isToday}>
            <CustomText
              fontWeight={isToday || selectedDate === date ? 'bold' : 'regular'}
              fontSize={16}
              color={isToday ? colors.WHITE : colors.BLACK}>
              {date}
            </CustomText>
          </DateContainer>
          {hasAttendance && <Image source={paw} style={styles.paw} />}
        </>
      )}
    </DatePressable>
  );
};

const DatePressable = styled.TouchableOpacity<{ isSelected: boolean }>`
  align-items: center;
  border-radius: 8px;
  width: ${deviceWidth / 7}px;
  height: ${deviceWidth / 7 + 12}px;
  border: ${({ isSelected }) => (isSelected ? `2px solid ${colors.ORANGE.BASE}` : 'none')};
`;

const DateContainer = styled.View<{ isToday: boolean }>`
  margin-top: 6px;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 34px;
  border-radius: 10px;
  background-color: ${({ isToday }) => (isToday ? colors.ORANGE.BASE : 'transparent')};
`;

const styles = StyleSheet.create({
  paw: {
    width: 20,
    height: 20,
    marginTop: 4,
  },
});

export default DateBox;
