import styled from 'styled-components/native';
import React, {useEffect, useState} from 'react';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import {colors} from '@/constants';
import Calendar from '@/components/calender/Calendar';
import {getMonthYearDetails, getNewMonthYear} from '@/utils/date';
import CustomHeader from '@/components/common/CustomHeader';

const RecordScreen = () => {
  const [selectedDate, setSelectedDate] = useState(0);
  const currentMonthYear = getMonthYearDetails(new Date());
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

  useEffect(() => {
    moveToToday();
  }, []);

  return (
    <Container>
      <CustomHeader title='월간 산책'>
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
        <FooterText>산책 정보</FooterText>
      </Footer>
      <InfoContainer>
        <InfoItem>
          <InfoHeader>
            <MaterialIcons name="timer" size={24} color={colors.ORANGE.BASE} />
            <InfoText>소요 시간</InfoText>
          </InfoHeader>
          <InfoDetail>45m 32s</InfoDetail>
        </InfoItem>
        <InfoItem>
          <InfoHeader>
            <MaterialIcons name="directions-walk" size={24} color={colors.ORANGE.BASE} />
            <InfoText>산책 거리</InfoText>
          </InfoHeader>
          <InfoDetail>2.5km</InfoDetail>
        </InfoItem>
        <InfoItem>
          <InfoHeader>
            <MaterialIcons name="pin-drop" size={24} color={colors.ORANGE.BASE} />
            <InfoText>등록 마커</InfoText>
          </InfoHeader>
          <InfoDetail>2개</InfoDetail>
        </InfoItem>
      </InfoContainer>
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
