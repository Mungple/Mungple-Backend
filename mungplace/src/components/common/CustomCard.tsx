import React from 'react';
import styled from 'styled-components/native';
import {ViewStyle, StyleProp} from 'react-native';

// 카드 컴포넌트의 props 타입 정의
interface CustomCardProps {
  style?: StyleProp<ViewStyle>;
  children?: React.ReactNode;
}

const CustomCard: React.FC<CustomCardProps> = ({
  style,
  children,
}) => {
  return (
    <CardContainer style={style}>
      {children}
    </CardContainer>
  );
};

const CardContainer = styled.View`
  background-color: #ffffff;
  border-radius: 16px;
  padding: 20px;
  max-width: 400px;
  margin: 20px;
  width: 100%;
`;

export default CustomCard;
