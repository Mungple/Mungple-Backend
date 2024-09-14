import React from 'react';
import styled from 'styled-components/native';
import {ViewStyle, StyleProp} from 'react-native';
import {colors} from '@/constants';

interface CustomCardProps {
  style?: StyleProp<ViewStyle>;
  children?: React.ReactNode;
}

const CustomCard: React.FC<CustomCardProps> = ({style, children}) => {
  return <CardContainer style={style}>{children}</CardContainer>;
};

const CardContainer = styled.View`
  background-color: ${colors.WHITE};
  border-radius: 16px;
  padding: 20px;
  max-width: 600px;
  margin: 20px;
  width: 100%;
`;

export default CustomCard;
