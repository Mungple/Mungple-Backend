import React from 'react';
import styled from 'styled-components/native';
import {ViewStyle, StyleProp} from 'react-native';
import {colors} from '@/constants';

interface CustomCardProps {
  onPress?: () => void;
  children?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}

const CustomCard: React.FC<CustomCardProps> = ({style, children, onPress}) => {
  return (
    <CardContainer style={style} onPress={onPress}>
      {children}
    </CardContainer>
  );
};

const CardContainer = styled.TouchableOpacity`
  background-color: ${colors.WHITE};
  border-radius: 16px;
  max-width: 600px;
  padding: 20px;
  width: 100%;
`;

export default CustomCard;
