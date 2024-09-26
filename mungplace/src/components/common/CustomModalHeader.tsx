import React from 'react';
import styled from 'styled-components/native';
import IonIcons from 'react-native-vector-icons/Ionicons';

import {colors} from '@/constants';

type CustomModalHeaderProps = {
  title: string;
  closeButton: () => void;
};

const CustomModalHeader: React.FC<CustomModalHeaderProps> = ({title, closeButton}) => {
  return (
    <Container>
      <Title>{title}</Title>
      <CloseButton onPress={closeButton}>
        <IonIcons name={'close'} size={32} color={colors.BLACK} />
      </CloseButton>
    </Container>
  );
};

export default CustomModalHeader;

const Container = styled.View`
  width: 100%;
  padding: 16px;
  position: relation;
  align-items: center;
  flex-direction: row;
  justify-content: center;
  border-bottom-width: 1px;
  border-bottom-color: ${colors.GRAY_300};
`;

const Title = styled.Text`
  font-size: 24px;
  font-weight: bold;
  text-align: center;
  color: ${colors.BLACK};
`;

const CloseButton = styled.TouchableOpacity`
  position: absolute;
  right: 20px;
`;
