import React, { useCallback, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';

import styled from 'styled-components/native';

import { colors } from '@/constants';
import { getMonthYearDetails, getNewMonthYear } from '@/utils/date';
import { getMonthWalks, getDayWalks } from '@/api/walk';

import { NativeStackScreenProps } from '@react-navigation/native-stack';

import { RecordStackParamList } from '@/navigations/stack/RecordStackNavigator';
import Calendar from '@/components/record/Calendar';
import MonthStatistics from '@/components/record/MonthStatistics';

// 월간 산책 목록 인터페이스
interface ExplorationInfo {
  startTime: string; // ISO 8601 형식의 날짜 문자열
  endTime: string; // ISO 8601 형식의 날짜 문자열
  explorationId: number; // 산책 ID
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

// 일간 산책 목록 인터페이스
interface DayListData {
  explorationId: number; // 산책 ID
  distance: number; // 산책 거리 (예: 미터)
  togertherDogIds: number[]; // 함께한 개의 ID 배열
}

// RecordScreen의 Props 타입 정의
type RecordScreenProps = NativeStackScreenProps<RecordStackParamList, 'Record'>;

const currentMonthYear = getMonthYearDetails(new Date());

const RecordScreen: React.FC<RecordScreenProps> = ({ navigation }) => {
  const [explorationInfos, setExplorationInfos] = useState<ExplorationInfo[]>([]);
  const [selectedDate, setSelectedDate] = useState<number>(0);
  const [monthYear, setMonthYear] = useState(currentMonthYear);
  const [attendance, setAttendance] = useState<number[]>([]);
  const [dayListData, setDayListData] = useState<DayListData[] | null>(null);
  // 현재 날짜로 이동하는 함수
  const moveToToday = () => {
    setSelectedDate(new Date().getDate());
    setMonthYear(getMonthYearDetails(new Date()));
  };
  // 산책 정보 배열을 이용하여 출석 정보를 업데이트하는 함수
  const processAttendance = (explorationInfos: ExplorationInfo[]) => {
    const days = [...new Set(explorationInfos.map((info) => new Date(info.endTime).getDate()))];
    setAttendance(days);
  };
  // 산책 정보 배열을 DayListData 배열로 변환하는 함수
  const processDayWalks = (explorationInfos: ExplorationInfo[]) => {
    const dayListData = explorationInfos.map((info) => ({
      explorationId: info.explorationId,
      distance: info.distance,
      togertherDogIds: info.togetherDogIds,
    }));
    setDayListData(dayListData);
    navigation.navigate('WalkList', { dayListData });
  };
  // 날짜 선택 시 일간 산책 목록을 가져오고 상태를 업데이트하는 함수
  const handlePressDate = async (date: number) => {
    const formattedDate = String(date).padStart(2, '0');
    const dateString = `${monthYear.year}-${monthYear.month}-${formattedDate}`;

    setSelectedDate(date);

    try {
      const data = await getDayWalks(dateString);
      console.log('일간 산책 목록:');
      console.log(data);
      processDayWalks(explorationInfos);
      console.log(dayListData);
    } catch (error) {
      console.error('일간 산책 목록 가져오기 실패:', error);
    }
  };

  const handleUpdateMonth = (increment: number) => {
    setMonthYear((prev) => getNewMonthYear(prev, increment));
  };

  useFocusEffect(
    useCallback(() => {
      const getData = async () => {
        try {
          const response: MonthRecords = await getMonthWalks(monthYear.year, monthYear.month);
          processAttendance(response.explorationInfos);
          setExplorationInfos(response.explorationInfos);
          console.log(response);
        } catch (err) {
          console.error(err);
        }
      };

      moveToToday();
      getData();
      return () => {};
    }, []),
  );

  return (
    <Container>
      <Calendar
        attendance={attendance}
        monthYear={monthYear}
        selectedDate={selectedDate}
        moveToToday={moveToToday}
        onPressDate={handlePressDate}
        onChangeMonth={handleUpdateMonth}
      />

      <MonthStatistics year={monthYear.year} month={monthYear.month} />
    </Container>
  );
};

const Container = styled.SafeAreaView`
  flex: 1;
  background-color: ${colors.WHITE};
`;

export default RecordScreen;
