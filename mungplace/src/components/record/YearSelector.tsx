import React, {useEffect, useState} from 'react';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import {FlatList, StyleSheet} from 'react-native';
import {colors, numbers} from '@/constants';
import styled from 'styled-components/native';

interface YearSelectorProps {
  isVisible: boolean; // 연도 선택기가 화면에 표시되는지 여부
  currentyear: number; // 현재 선택된 연도
  onChangeYear: (year: number) => void; // 연도 변경 시 호출되는 함수
  hide: () => void; // 연도 선택기를 숨기는 함수
}

function YearSelector({
  isVisible,
  currentyear,
  onChangeYear,
  hide,
}: YearSelectorProps) {
  const [scrollY, setScrollY] = useState(0);

  // 연도 선택기가 표시될 때, 현재 연도를 기준으로 스크롤 위치를 설정
  useEffect(() => {
    const yearIndex = currentyear - numbers.MIN_CALENDAR_YEAR;
    const currentRow = Math.floor(
      yearIndex / numbers.CALENDAR_YEAR_SELECTOR_COLUMN,
    );
    const scrollToY = currentRow * 50;

    setScrollY(scrollToY);
  }, [isVisible, currentyear]);

  return (
    <>
      {isVisible && (
        <Container>
          <YearsContainer>
            <FlatList
              style={styles.scrollContainer}
              showsVerticalScrollIndicator={false}
              contentOffset={{x: 0, y: scrollY}}
              initialNumToRender={currentyear - numbers.MIN_CALENDAR_YEAR}
              data={Array.from(
                {
                  length:
                    numbers.MAX_CALENDAR_YEAR - numbers.MIN_CALENDAR_YEAR + 1,
                },
                (_, index) => ({
                  id: index,
                  num: index + numbers.MIN_CALENDAR_YEAR,
                }),
              )}
              renderItem={({item}) => (
                <YearButton
                  key={item.num}
                  onPress={() => onChangeYear(item.num)}
                  selected={currentyear === item.num}>
                  <YearText selected={currentyear === item.num}>
                    {item.num}
                  </YearText>
                </YearButton>
              )}
              keyExtractor={item => String(item.num)}
              numColumns={numbers.CALENDAR_YEAR_SELECTOR_COLUMN}
            />
          </YearsContainer>

          {/* 닫기 버튼 */}
          <CloseButton onPress={hide}>
            <CloseText>닫기</CloseText>
            <MaterialIcons name="keyboard-arrow-up" size={20} />
          </CloseButton>
        </Container>
      )}
    </>
  );
}

const Container = styled.View`
  position: absolute;
  width: 100%;
`;

const YearsContainer = styled.View`
  align-items: center;
  background-color: ${colors.WHITE};
`;

const YearButton = styled.Pressable<{selected: boolean}>`
  width: 80px;
  height: 40px;
  padding: 10px;
  margin: 5px;
  border-radius: 5px;
  align-items: center;
  justify-content: center;
  background-color: ${props =>
    props.selected ? colors.ORANGE.BASE : 'transparent'};
`;

const YearText = styled.Text<{selected: boolean}>`
  font-size: 16px;
  font-weight: ${props => (props.selected ? '600' : '500')};
  color: ${props => (props.selected ? colors.WHITE : colors.GRAY_500)};
`;

const CloseButton = styled.Pressable`
  flex: 1;
  padding: 15px;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  border-bottom-width: 1px;
  border-color: ${colors.GRAY_200};
  background-color: ${colors.WHITE};
`;

const CloseText = styled.Text`
  color: ${colors.BLACK};
  font-size: 16px;
  font-weight: 600;
`;

const styles = StyleSheet.create({
  scrollContainer: {
    maxHeight: 200,
    backgroundColor: colors.WHITE,
  },
});

export default YearSelector;
