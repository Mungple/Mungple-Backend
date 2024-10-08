import React from 'react';
import { Image } from 'react-native';
import styled from 'styled-components/native';
import whitedog from '@/assets/whitedog.gif'

const LoadingContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
`;

const LoadingSpinner = () => {
  return (
    <LoadingContainer>
      <Image source={whitedog} style={{ width: 100, height: 100}}/>
    </LoadingContainer>
  );
};

export default LoadingSpinner;