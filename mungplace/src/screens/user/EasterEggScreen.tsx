import React, { useRef } from 'react';
import styled from 'styled-components/native';
import { Animated, Image, TouchableWithoutFeedback } from 'react-native';

import petBowlImage from '@/assets/pet_bowl.png'
import eatImage from '@/assets/eat.png'
import { colors } from '@/constants';

const EasterEggScreen: React.FC = () => {
  const dropAnim = useRef(new Animated.Value(0)).current;
  
  const handlePress = () => {
    // 초기값 설정
    dropAnim.setValue(0);
    
    // 애니메이션 실행
    Animated.timing(dropAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  };
  
  const kibbleDrop = dropAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-300, -60],
  });
  
  return (
    <ClickContainer onPress={handlePress}>
      <SubContainer>
        <Kibble style={{ transform: [{ translateY: kibbleDrop }] }} source={eatImage} />
        <Bowl source={petBowlImage} />
      </SubContainer>
    </ClickContainer>
  );
};

const ClickContainer = styled(TouchableWithoutFeedback)`
  flex: 1;
  align-items: center;
  justify-content: center;
`;

const SubContainer = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
  background-color: ${colors.WHITE};
`;

const Bowl = styled.Image`
  position: absolute;
  height: 300px;
  width: 300px;
`;

const Kibble = styled(Animated.Image)`
  z-index: 3;
  width: 80px;
  height: 120px;
  position: absolute;
`;

export default EasterEggScreen;
