import React, {useCallback, useState} from 'react';
import {useFocusEffect} from '@react-navigation/native';

import styled from 'styled-components/native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import {colors} from '@/constants';
import {getMonthYearDetails, getNewMonthYear} from '@/utils/date';
import {getMonthWalks} from '@/api/walk';

import CustomHeader from '@/components/common/CustomHeader';
import Calendar from '@/components/record/Calendar';
import MonthStatistics from '@/components/record/MonthStatistics';

// 산책 목록 인터페이스
interface ExplorationInfo {
  startTime: string; // ISO 8601 형식의 날짜 문자열
  endTime: string; // ISO 8601 형식의 날짜 문자열
  distance: number; // 산책 거리 (예: 미터)
  togetherDogIds: number[]; // 함께한 개의 ID 배열
  points: number | null; // 포인트 (null일 수 있음)
}
// 월간 산책 정보 인터페이스
interface MonthRecords {
  year: number; // 연도
  month: number; // 월
  totalExplorations: number; // 총 산책 횟수
  explorationInfos: ExplorationInfo[]; // ExplorationInfo 객체 배열
}

const currentMonthYear = getMonthYearDetails(new Date());

const RecordScreen = () => {
  const [selectedDate, setSelectedDate] = useState(0);
  const [monthYear, setMonthYear] = useState(currentMonthYear);

  const moveToToday = () => {
    setSelectedDate(new Date().getDate());
    setMonthYear(getMonthYearDetails(new Date()));
  };

  const handlePressDate = (date: number) => {
    setSelectedDate(date);
  };

  const handleUpdateMonth = (increment: number) => {
    setMonthYear(prev => getNewMonthYear(prev, increment));
  };

  useFocusEffect(
    useCallback(() => {
      moveToToday();
      getMonthWalks(2024, 9);
      return () => {};
    }, []),
  );

  return (
    <Container>
      <CustomHeader title="월간 산책" />
      <Calendar
        attendance={[]}
        monthYear={monthYear}
        selectedDate={selectedDate}
        moveToToday={moveToToday}
        onPressDate={handlePressDate}
        onChangeMonth={handleUpdateMonth}
      />
      <Footer>
        <FooterText>월간 통계</FooterText>
      </Footer>
      <MonthStatistics year={monthYear.year} month={monthYear.month} />
    </Container>
  );
};

const Container = styled.SafeAreaView`
  flex: 1;
  background-color: ${colors.WHITE};
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

export default RecordScreen;
