import React, {useEffect, useState} from 'react';
import {FlatList, StyleSheet} from 'react-native';
import styled from 'styled-components/native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {colors} from '@/constants';

interface MonthSelectorProps {
  isVisible: boolean;
  currentmonth: number;
  onChangeMonth: (month: number) => void;
  hide: () => void;
}

const months = [
  '1월',
  '2월',
  '3월',
  '4월',
  '5월',
  '6월',
  '7월',
  '8월',
  '9월',
  '10월',
  '11월',
  '12월',
];

function MonthSelector({
  isVisible,
  currentmonth,
  onChangeMonth,
  hide,
}: MonthSelectorProps) {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const scrollToY = currentmonth * 50;
    setScrollY(scrollToY);
  }, [isVisible, currentmonth]);

  return (
    <>
      {isVisible && (
        <Container>
          <MonthsContainer>
            <FlatList
              style={styles.scrollContainer}
              showsVerticalScrollIndicator={false}
              contentOffset={{x: 0, y: scrollY}}
              data={months.map((month, index) => ({id: index, month}))}
              renderItem={({item}) => (
                <MonthButton
                  key={item.id}
                  onPress={() => onChangeMonth(item.id)}
                  selected={currentmonth === item.id}>
                  <MonthText selected={currentmonth === item.id}>
                    {item.month}
                  </MonthText>
                </MonthButton>
              )}
              keyExtractor={item => String(item.id)}
              numColumns={4}
            />
          </MonthsContainer>
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

const MonthsContainer = styled.View`
  align-items: center;
  background-color: ${colors.WHITE};
`;

const MonthButton = styled.Pressable<{selected: boolean}>`
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

const MonthText = styled.Text<{selected: boolean}>`
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

export default MonthSelector;
