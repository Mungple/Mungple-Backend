import React, {useContext} from 'react';
import {ViewStyle} from 'react-native';

import {colors} from '@/constants';
import {RadioGroupContext} from './RadioButtonGroup';
import styled from 'styled-components/native';

interface RadioButtonItemProps {
  value: string;
  children?: React.ReactNode;
  disabled?: boolean;
  containerStyle?: ViewStyle;
}

const RadioButtonItem = ({
  value,
  children,
  disabled,
  containerStyle,
}: RadioButtonItemProps) => {
  const {onSelected, selected} = useContext(RadioGroupContext);
  const isSelected = selected === value;

  // 라디오 버튼 선택 이벤트 트리거 함수
  const trigger = () => {
    if (onSelected && !disabled) {
      onSelected(value);
    }
  };

  return (
    <RadioButtonContainer onPress={trigger} style={containerStyle} disabled={disabled}>
      <RadioCircle isSelected={isSelected} disabled={disabled}>
        {isSelected && <SelectedCircle disabled={disabled} />}
      </RadioCircle>
      {children && <Label onPress={trigger}>{children}</Label>}
    </RadioButtonContainer>
  );
};

export default RadioButtonItem;

const RadioButtonContainer = styled.Pressable<{disabled?: boolean}>`
  margin-right: 10px;
  flex-direction: row;
  align-items: center;
  opacity: ${props => (props.disabled ? 0.5 : 1)};
`;

const RadioCircle = styled.View<{isSelected: boolean; disabled?: boolean}>`
  border-width: 1px;
  padding: 2px;
  width: 24px;
  height: 24px;
  border-radius: 50px;
  align-items: center;
  justify-content: center;
  border-color: ${props => props.isSelected ? colors.ORANGE.BASE : colors.GRAY_400};
  background-color: ${props => props.disabled ? colors.ORANGE.LIGHTER : 'transparent'};
`;

const SelectedCircle = styled.View<{disabled?: boolean}>`
  background-color: ${props => props.disabled ? colors.GRAY_400 : colors.ORANGE.BASE};
  width: 12px;
  height: 12px;
  border-radius: 50px;
`;

const Label = styled.Pressable`
  color: ${colors.GRAY_400};
  margin-left: 8px;
`;

