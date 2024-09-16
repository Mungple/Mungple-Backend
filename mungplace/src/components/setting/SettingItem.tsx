import React, {ReactNode} from 'react';
import {PressableProps} from 'react-native';
import styled from 'styled-components/native';

import {colors} from '@/constants';

interface SettingItemProps extends PressableProps {
  title: string;
  subTitle?: string;
  icon?: ReactNode;
  color?: string;
}

function SettingItem({
  title,
  subTitle,
  icon = null,
  color,
  ...props
}: SettingItemProps) {

  return (
    <Container {...props}>
      {icon}
      <TitleContainer>
        <TitleText style={{color: color ?? colors.BLACK}}>
          {title}
        </TitleText>
        {subTitle && <SubTitleText>{subTitle}</SubTitleText>}
      </TitleContainer>
    </Container>
  );
}

const Container = styled.Pressable`
  flex-direction: row;
  align-items: center;
  gap: 10px;
  padding: 15px;
  background-color: ${colors.WHITE};
  border-color: ${colors.GRAY_200};
  border-bottom-width: 1px;
  border-top-width: 1px;

  &:active {
    background-color: ${colors.GRAY_200};
  }
`;

const TitleContainer = styled.View`
  flex: 1;
  flex-direction: row;
  justify-content: space-between;
`;

const TitleText = styled.Text`
  font-size: 16px;
  font-weight: 500;
  color: ${colors.BLACK};
`;

const SubTitleText = styled.Text`
  color: ${colors.GRAY_300};
`;

export default SettingItem;
