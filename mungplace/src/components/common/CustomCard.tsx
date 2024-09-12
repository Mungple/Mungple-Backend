import React from 'react';
import styled from 'styled-components/native';
import {ViewStyle, StyleProp} from 'react-native';

// 카드 컴포넌트의 props 타입을 정의하는 인터페이스
interface CustomCardProps {
  style?: StyleProp<ViewStyle>; // 사용자 지정 스타일
  children?: React.ReactNode; // 카드 내부에 추가할 컴포넌트나 요소들
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

// 기본 스타일을 가진 CardContainer
const CardContainer = styled.View`
  background-color: #ffffff;
  border-radius: 16px;
  padding: 20px;
  max-width: 400px;
  margin: 20px;
  width: 100%;
`;

export default CustomCard;
