import React, { ReactNode } from 'react';
import { TouchableOpacityProps } from 'react-native';
import styled from 'styled-components/native';

import { colors } from '@/constants';
import CustomText from '../common/CustomText';

interface SettingItemProps extends TouchableOpacityProps {
  title: string;
  subTitle?: string;
  icon?: ReactNode;
  color?: string;
}

function SettingItem({ title, subTitle, icon = null, ...props }: SettingItemProps) {
  return (
    <Container {...props}>
      {icon}
      <TitleContainer>
        <CustomText fontSize={16} color={title === '로그아웃' ? colors.RED.DARKER : colors.BLACK}>
          {title}
        </CustomText>
        {subTitle && <CustomText color={colors.GRAY_300}>{subTitle}</CustomText>}
      </TitleContainer>
    </Container>
  );
}

const Container = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  gap: 10px;
  padding: 15px;
  background-color: ${colors.WHITE};
  border-color: ${colors.GRAY_100};
  border-bottom-width: 1px;
`;

const TitleContainer = styled.View`
  flex: 1;
  flex-direction: row;
  justify-content: space-between;
`;

export default SettingItem;
