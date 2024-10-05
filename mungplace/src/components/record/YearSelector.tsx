import React, { useEffect, useState } from 'react';
import { FlatList, Modal, StyleSheet } from 'react-native';
import styled from 'styled-components/native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { colors, numbers } from '@/constants';
import { useUserStore } from '@/state/useUserStore';

interface YearSelectorProps {
  isVisible: boolean;
  currentyear: number;
  onChangeYear: (year: number) => void; // 연도 변경 시 호출되는 함수
  hide: () => void;
}

const YearSelector = ({ isVisible, currentyear, onChangeYear, hide }: YearSelectorProps) => {
  const minYear =
    new Date(useUserStore((state) => state.userData?.createdAt)).getFullYear() || 2024; // 가입 연도
  const maxYear = new Date().getFullYear(); // 현재 연도
  const [scrollY, setScrollY] = useState(0);

  // 연도 선택기가 표시될 때, 현재 연도를 기준으로 스크롤 위치를 설정
  useEffect(() => {
    const yearIndex = currentyear - minYear; // 현재 연도 인덱스
    const currentRow = Math.floor(yearIndex / numbers.CALENDAR_SELECTOR_COLUMN);
    const scrollToY = currentRow * 50; // 각 항목의 높이에 맞게 스크롤 위치 계산

    setScrollY(scrollToY);
  }, [isVisible, currentyear]);

  return (
    <Modal visible={isVisible} transparent={true} animationType="fade" onRequestClose={hide}>
      <Container>
        <YearsContainer>
          <FlatList
            contentContainerStyle={{ alignItems: 'center' }}
            style={styles.scrollContainer}
            showsVerticalScrollIndicator={false}
            contentOffset={{ x: 0, y: scrollY }}
            data={Array.from({ length: maxYear - minYear + 1 }, (_, index) => ({
              id: index,
              num: index + minYear,
            }))}
            renderItem={({ item }) => (
              <YearButton
                key={item.id}
                onPress={() => onChangeYear(item.num)}
                selected={currentyear === item.num}>
                <YearText selected={currentyear === item.num}>{item.num}</YearText>
              </YearButton>
            )}
            keyExtractor={(item) => String(item.id)}
            numColumns={4}
          />
          <CloseButton onPress={hide}>
            <CloseText>닫기</CloseText>
            <MaterialIcons name="keyboard-arrow-up" size={20} />
          </CloseButton>
        </YearsContainer>
      </Container>
    </Modal>
  );
};

const Container = styled.View`
  flex: 1;
  justify-content: flex-start;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.5);
`;

const YearsContainer = styled.View`
  width: 90%;
  max-height: 400px;
  background-color: ${colors.WHITE};
  border-radius: 10px;
  padding: 20px;
`;

const YearButton = styled.TouchableOpacity<{ selected: boolean }>`
  width: 80px;
  height: 40px;
  padding: 10px;
  margin: 5px;
  border-radius: 5px;
  align-items: center;
  justify-content: center;
  background-color: ${(props) => (props.selected ? colors.ORANGE.BASE : 'transparent')};
`;

const YearText = styled.Text<{ selected: boolean }>`
  font-size: 16px;
  font-weight: ${(props) => (props.selected ? '600' : '500')};
  color: ${(props) => (props.selected ? colors.WHITE : colors.GRAY_500)};
`;

const CloseButton = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  justify-content: center;
  padding: 15px;
  border-top-width: 1px;
  border-top-color: ${colors.GRAY_200};
  background-color: ${colors.WHITE};
  border-bottom-left-radius: 10px;
  border-bottom-right-radius: 10px;
  margin-top: 15px;
`;

const CloseText = styled.Text`
  color: ${colors.BLACK};
  font-size: 16px;
  font-weight: 600;
  margin-right: 10px;
`;

const styles = StyleSheet.create({
  scrollContainer: {
    maxHeight: 200,
    backgroundColor: colors.WHITE,
  },
});

export default YearSelector;
