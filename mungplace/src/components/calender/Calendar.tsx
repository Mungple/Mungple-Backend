import React from 'react';
import styled from 'styled-components/native';
import {FlatList, SafeAreaView} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import DateBox from './DateBox';
import {colors} from '@/constants';
import DayOfWeeks from './DayOfWeeks';
import useModal from '@/hooks/useModal';
import {MonthYear, isSameAsCurrentDate} from '@/utils/date';
import YearSelector from './YearSelector';

interface CalendarProps<T> {
  monthYear: MonthYear;
  selectedDate: number;
  attendance: Record<number, T[]>;
  moveToToday: () => void;
  onPressDate: (date: number) => void;
  onChangeMonth: (increment: number) => void;
}

function Calendar<T>({
  monthYear,
  attendance,
  selectedDate,
  moveToToday,
  onPressDate,
  onChangeMonth,
}: CalendarProps<T>) {
  const yearSelector = useModal();
  const {month, year, lastDate, firstDOW} = monthYear;

  const handleChangeYear = (selectYear: number) => {
    onChangeMonth((selectYear - year) * 12);
    yearSelector.hide();
  };

  return (
    <SafeAreaView>
      {/* 헤더 부분 */}
      <HeaderContainer>
        <MonthButton onPress={() => onChangeMonth(-1)}>
          <Ionicons name="arrow-back" size={25} color={colors.BLACK} />
        </MonthButton>
        <MonthYearContainer onPress={yearSelector.show}>
          <TitleText>
            {year}년 {month}월
          </TitleText>
          <MaterialIcons
            name="keyboard-arrow-down"
            size={20}
            color={colors.GRAY_500}
          />
        </MonthYearContainer>
        <MonthButton onPress={() => onChangeMonth(1)}>
          <Ionicons name="arrow-forward" size={25} color={colors.BLACK} />
        </MonthButton>
      </HeaderContainer>

      {/* 요일 부분 */}
      <DayOfWeeks />

      {/* 본문 부분 */}
      <BodyContainer>
        <FlatList
          data={Array.from({length: lastDate + firstDOW}, (_, i) => ({
            id: i,
            date: i - firstDOW + 1,
          }))}
          renderItem={({item}) => (
            <DateBox
              date={item.date}
              onPressDate={onPressDate}
              selectedDate={selectedDate}
              hasAttendance={Boolean(attendance[item.date])}
              isToday={isSameAsCurrentDate(year, month, item.date)}
            />
          )}
          keyExtractor={item => String(item.id)}
          numColumns={7}
        />
      </BodyContainer>

      {/* 년도 선택 모달 */}
      <YearSelector
        isVisible={yearSelector.isVisible}
        currentyear={year}
        onChangeYear={handleChangeYear}
        hide={yearSelector.hide}
      />
    </SafeAreaView>
  );
}

const HeaderContainer = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-horizontal: 25px;
  margin-vertical: 16px;
`;

const MonthYearContainer = styled.Pressable`
  flex-direction: row;
  align-items: center;
  padding: 10px;
`;

const MonthButton = styled.Pressable`
  padding: 10px;
`;

const TitleText = styled.Text`
  font-size: 18px;
  font-weight: 500;
  color: ${colors.BLACK};
`;

const BodyContainer = styled.View`
  border-bottom-width: 1px;
  border-bottom-color: ${colors.GRAY_100};
  background-color: ${colors.WHITE};
`;

export default Calendar;
