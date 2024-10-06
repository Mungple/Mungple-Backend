import React from 'react';
import styled from 'styled-components/native';
import { Text, TextProps } from 'react-native';
import { colors } from '@/constants';

type CustomTextProps = TextProps & {
  fontWeight?: 'bold' | 'regular'; // bold 또는 regular 속성
  fontSize?: number; // 폰트 사이즈
  color?: string; // 폰트 색상
};

const CustomText: React.FC<CustomTextProps> = ({
  fontWeight = 'regular',
  fontSize,
  color,
  children,
  ...props
}) => {
  return (
    <StyledText fontWeight={fontWeight} fontSize={fontSize} color={color} {...props}>
      {children}
    </StyledText>
  );
};

const StyledText = styled(Text)<{
  fontWeight: 'bold' | 'regular';
  fontSize?: number;
  color?: string;
}>`
  font-family: ${({ fontWeight }) =>
    fontWeight === 'bold'
      ? 'OTLaundryGothicB'
      : 'LaundryGothicOTF Regular'}; /* Bold 또는 Regular 폰트 설정 */
  font-size: ${({ fontSize }) =>
    fontSize ? `${fontSize}px` : '16px'}; /* 폰트 사이즈 설정, 기본값은 14px */
  color: ${({ color }) => (color ? color : colors.BLACK)}; /* 텍스트 색상 설정, 기본값은 BLACK */
`;

export default CustomText;
