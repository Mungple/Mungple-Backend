import React, { useCallback, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';

import styled from 'styled-components/native';

import { colors } from '@/constants';
import { getMonthYearDetails, getNewMonthYear } from '@/utils/date';
import { getMonthWalks, getDateWalks, getWalkDetail } from '@/api/walk';

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
  year: number;
  month: number;
  totalExplorations: number; // 총 산책 횟수
  explorationInfos: ExplorationInfo[]; // ExplorationInfo 객체 배열
}

const currentMonthYear = getMonthYearDetails(new Date());

const RecordScreen = () => {
  const [selectedDate, setSelectedDate] = useState<number | 0>(0);
  const [monthYear, setMonthYear] = useState(currentMonthYear);
  const [attendance, setAttendance] = useState<number[]>([]);

  const moveToToday = () => {
    setSelectedDate(new Date().getDate());
    setMonthYear(getMonthYearDetails(new Date()));
  };

  const handlePressDate = async (date: number) => {
    // 1자리 날짜를 2자리 형식으로 변환
    const formattedDate = String(date).padStart(2, '0'); // 01, 02, ..., 10 등으로 변환
    const dateString = `${monthYear.year}-${monthYear.month}-${formattedDate}`;

    setSelectedDate(date); // 상태를 업데이트

    try {
      const data = await getDateWalks(dateString); // 비동기적으로 데이터 가져오기
      console.log(data); // 데이터를 받아온 후 처리
    } catch (error) {
      console.error('일간 산책 기록 가져오기 실패:', error);
    }
  };

  const handleUpdateMonth = (increment: number) => {
    setMonthYear((prev) => getNewMonthYear(prev, increment));
  };

  const processAttendance = (explorationInfos: ExplorationInfo[]) => {
    // endTime에서 날짜(day) 추출하고 중복 제거
    const days = [
      ...new Set(
        explorationInfos.map((info) => new Date(info.endTime).getDate()),
      ),
    ];
    setAttendance(days);
  };

  useFocusEffect(
    useCallback(() => {
      const getData = async () => {
        try {
          const response: MonthRecords = await getMonthWalks(
            monthYear.year,
            monthYear.month,
          );
          processAttendance(response.explorationInfos);
          console.log(response);
        } catch (err) {
          console.error(err);
        }
      };

      moveToToday();
      getData();
      console.log(attendance);
      return () => {};
    }, []),
  );

  return (
    <Container>
      <CustomHeader title="월간 산책" />
      <Calendar
        attendance={attendance}
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
