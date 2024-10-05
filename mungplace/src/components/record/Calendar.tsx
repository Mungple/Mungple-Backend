import React from 'react';
import { FlatList, SafeAreaView } from 'react-native';
import styled from 'styled-components/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { colors } from '@/constants';
import { MonthYear, isSameAsCurrentDate } from '@/utils/date';
import DayOfWeeks from './DayOfWeeks';
import DateBox from './DateBox';
import YearSelector from './YearSelector';
import MonthSelector from './MonthSelector';

interface CalendarProps {
  monthYear: MonthYear;
  selectedDate: number;
  attendance: number[];
  moveToToday: () => void;
  onPressDate: (date: number) => void;
  onChangeMonth: (increment: number) => void;
}

const Calendar = ({
  monthYear,
  attendance,
  selectedDate,
  moveToToday,
  onPressDate,
  onChangeMonth,
}: CalendarProps) => {
  const { month, year, lastDate, firstDOW } = monthYear;
  const [isMonthSelectorVisible, setMonthSelectorVisible] = React.useState<boolean>(false);
  const [isYearSelectorVisible, setYearSelectorVisible] = React.useState<boolean>(false);

  const handleChangeYear = (selectYear: number) => {
    onChangeMonth((selectYear - year) * 12);
    setYearSelectorVisible(false);
  };

  const handleChangeMonth = (selectMonth: number) => {
    onChangeMonth(selectMonth - month + 1);
    setMonthSelectorVisible(false);
  };

  return (
    <SafeAreaView>
      {/* 헤더 부분 */}
      <HeaderContainer>
        <MonthButton onPress={() => onChangeMonth(-1)}>
          <Ionicons name="arrow-back" size={25} color={colors.GRAY_500} />
        </MonthButton>
        <MonthYearContainer>
          <SelectBox onPress={() => setYearSelectorVisible(true)}>
            <TitleText>{year}년</TitleText>
          </SelectBox>
          <SelectBox onPress={() => setMonthSelectorVisible(true)}>
            <TitleText>{month}월</TitleText>
          </SelectBox>
        </MonthYearContainer>
        <MonthButton onPress={() => onChangeMonth(1)}>
          <Ionicons name="arrow-forward" size={25} color={colors.GRAY_500} />
        </MonthButton>
      </HeaderContainer>
      <TodayButton onPress={moveToToday}>
        <SubTitleText>Today</SubTitleText>
      </TodayButton>
      {/* 요일 부분 */}
      <DayOfWeeks />
      {/* 본문 부분 */}
      <BodyContainer>
        <FlatList
          data={Array.from({ length: lastDate + firstDOW }, (_, i) => ({
            id: i,
            date: i - firstDOW + 1,
          }))}
          renderItem={({ item }) => (
            <DateBox
              date={item.date}
              onPressDate={onPressDate}
              selectedDate={selectedDate}
              hasAttendance={Boolean(attendance.includes(item.date))}
              isToday={isSameAsCurrentDate(year, month, item.date)}
            />
          )}
          keyExtractor={(item) => String(item.id)}
          numColumns={7}
        />
      </BodyContainer>
      {/* 년도 선택 모달 */}
      <YearSelector
        isVisible={isYearSelectorVisible}
        currentyear={year}
        onChangeYear={handleChangeYear}
        hide={() => setYearSelectorVisible(false)}
      />
      {/* 월 선택 모달 */}
      <MonthSelector
        isVisible={isMonthSelectorVisible}
        currentmonth={month}
        onChangeMonth={handleChangeMonth}
        hide={() => setMonthSelectorVisible(false)}
      />
    </SafeAreaView>
  );
};

const HeaderContainer = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-horizontal: 20px;
  margin-top: 10px;
`;

const MonthYearContainer = styled.View`
  flex-direction: row;
  align-items: center;
  padding: 10px;
`;

const SelectBox = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  padding: 10px;
`;

const MonthButton = styled.TouchableOpacity`
  padding: 5px;
  border-radius: 10px;
  border-width: 1px;
  border-color: ${colors.GRAY_100};
`;

const TodayButton = styled.TouchableOpacity`
  align-items: center;
  margin-bottom: 10px;
  padding: 5px;
`;

const TitleText = styled.Text`
  font-size: 20px;
  font-weight: bold;
  color: ${colors.BLACK};
`;

const SubTitleText = styled.Text`
  font-size: 16px;
  font-weight: bold;
  color: ${colors.GRAY_500};
`;

const BodyContainer = styled.View`
  border-bottom-width: 1px;
  border-bottom-color: ${colors.GRAY_100};
  background-color: ${colors.WHITE};
`;

export default Calendar;
