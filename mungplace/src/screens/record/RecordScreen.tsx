import React, {useCallback, useEffect, useState} from 'react';
import {useFocusEffect} from '@react-navigation/native';

import styled from 'styled-components/native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import {colors} from '@/constants';
import Calendar from '@/components/calender/Calendar';
import {getMonthYearDetails, getNewMonthYear} from '@/utils/date';

import MonthStatistics from '@/components/record/MonthStatistics';
import CustomHeader from '@/components/common/CustomHeader';

import {getMonthWalks} from '@/api/walk';

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

const RecordScreen = () => {
  const [selectedDate, setSelectedDate] = useState(0);
  const currentMonthYear = getMonthYearDetails(new Date());
  const [monthYear, setMonthYear] = useState(currentMonthYear);
  const [records, setRecords] = useState({} as MonthRecords);

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
      <CustomHeader title="월간 산책">
        <DropdownContainer>
          <DropdownText>뭉치1</DropdownText>
          <MaterialIcons name="keyboard-arrow-down" size={20} />
        </DropdownContainer>
      </CustomHeader>

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
      <MonthStatistics />
    </Container>
  );
};

const Container = styled.SafeAreaView`
  flex: 1;
  background-color: ${colors.WHITE};
`;

const DropdownContainer = styled.View`
  flex-direction: row;
  align-items: center;
`;

const DropdownText = styled.Text`
  font-size: 18px;
  color: ${colors.ORANGE.BASE};
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

const InfoContainer = styled.View`
  flex: 1;
  padding-left: 20px;
  padding-right: 20px;
  justify-content: space-around;
`;

const InfoItem = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

const InfoHeader = styled.Text`
  align-items: center;
`;

const InfoText = styled.Text`
  font-size: 16px;
  color: ${colors.BLACK};
`;

const InfoDetail = styled.Text`
  font-size: 18px;
  font-weight: bold;
  color: ${colors.BLACK};
`;

export default RecordScreen;
