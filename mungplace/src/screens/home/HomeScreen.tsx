import React from 'react';
import {Dimensions, Text} from 'react-native';
import styled from 'styled-components/native';

import {colors, mapNavigations} from '@/constants';
import {useAppStore} from '@/state/useAppStore';
import {useNavigation} from '@react-navigation/native';
import {MapStackParamList} from '@/navigations/stack/MapStackNavigator';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';

import CustomCard from '@/components/common/CustomCard';
import CustomButton from '@/components/common/CustomButton';

const {height: windowHeight} = Dimensions.get('window');

const HomeScreen: React.FC = () => {
  const setWalkingStart = useAppStore(state => state.setWalkingStart);
  const navigation = useNavigation<NativeStackNavigationProp<MapStackParamList>>();

  const handleWalkingStart = () => {
    setWalkingStart(true);
    navigation.navigate(mapNavigations.WALKING);
  };

  return (
    <Container>
      <ImageCard />

      <DogInfo>
        <Col>
          <HeaderText>반려견 정보</HeaderText>
        </Col>
        <Col>
          <Row>
            <RightText>성별</RightText>
            <RightTextBold>남아</RightTextBold>
          </Row>
          <Row>
            <RightText>나이</RightText>
            <RightTextBold>36개월</RightTextBold>
          </Row>
          <Row>
            <RightText>몸무게</RightText>
            <RightTextBold>2kg</RightTextBold>
          </Row>
        </Col>
      </DogInfo>

      <CustomButton label="산책 시작하기" onPress={handleWalkingStart} />
    </Container>
  );
};

export default HomeScreen;

const Container = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  padding: 20px;
`;

const ImageCard = styled(CustomCard).attrs({
  style: {
    borderWidth: 1,
  },
})`
  height: ${windowHeight * 0.42}px;
`;

const DogInfo = styled(CustomCard).attrs({})`
  backgroundColor: ${colors.BEIGE.LIGHTER};
  padding: 30px;
  flex-direction: row;
  align-items: center;
`;

const Col = styled.View`
  flex: 1;
`;

const Row = styled.View`
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: 20px;
`;

const HeaderText = styled.Text`
  font-size: 20px;
  color: ${colors.BLACK};
`;

const RightText = styled.Text`
  font-size: 20px;
  color: ${colors.BLACK};
`;

const RightTextBold = styled(RightText)`
  font-weight: bold;
  text-align: right;
`;
