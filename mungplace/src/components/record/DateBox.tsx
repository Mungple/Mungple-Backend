import React from 'react';
import { Dimensions, Pressable } from 'react-native';
import styled from 'styled-components/native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import { colors } from '@/constants';

interface DateBoxProps {
  date: number;
  isToday: boolean;
  selectedDate: number;
  hasAttendance: boolean;
  onPressDate: (date: number) => void;
}

const deviceWidth = Dimensions.get('window').width;

const DateBox = ({
  date,
  isToday,
  selectedDate,
  hasAttendance,
  onPressDate,
}: DateBoxProps) => {
  return (
    <DatePressable
      isSelected={selectedDate === date}
      onPress={() => onPressDate(date)}>
      {date > 0 && (
        <>
          <DateContainer isToday={isToday}>
            <DateText isToday={isToday} isSelected={selectedDate === date}>
              {date}
            </DateText>
          </DateContainer>
          {hasAttendance && (
            <MaterialIcons
              name="check-circle"
              size={18}
              color={colors.ORANGE.BASE}
            />
          )}
        </>
      )}
    </DatePressable>
  );
};

const DatePressable = styled(Pressable)<{
  isSelected: boolean;
}>`
  align-items: center;
  border-radius: 8px;
  width: ${deviceWidth / 7}px;
  height: ${deviceWidth / 7 + 12}px;
  border: ${({ isSelected }) =>
    isSelected ? `2px solid ${colors.ORANGE.BASE}` : 'none'};
`;

const DateContainer = styled.View<{ isToday: boolean }>`
  margin-top: 6px;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 32px;
  border-radius: 8px;
  background-color: ${({ isToday }) =>
    isToday ? colors.ORANGE.BASE : 'transparent'};
`;

const DateText = styled.Text<{ isToday: boolean; isSelected: boolean }>`
  font-size: 17px;
  color: ${({ isToday }) => (isToday ? colors.WHITE : colors.BLACK)};
  font-weight: ${({ isToday, isSelected }) =>
    isToday || isSelected ? 'bold' : 'normal'};
`;

export default DateBox;
