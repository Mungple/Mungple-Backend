import React from 'react';
import {Dimensions, Text} from 'react-native';
import styled from 'styled-components/native';

import {mapNavigations} from '@/constants';
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
          <Text>반려견 정보</Text>
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

      <StyledButton label="산책 시작하기" onPress={handleWalkingStart} />
    </Container>
  );
};

export default HomeScreen;

const Container = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  padding: 20px;
  background-color: #f2f2f2;
`;

const ImageCard = styled(CustomCard).attrs({
  style: {
    backgroundColor: '#f8f9fa',
    borderColor: '#ddd',
    borderWidth: 1,
  },
  titleStyle: {
    color: '#007AFF',
  },
  descriptionStyle: {
    color: '#333',
  },
})`
  height: ${windowHeight * 0.42}px;
`;

const DogInfo = styled(CustomCard).attrs({
  style: {
    backgroundColor: '#fdebd0',
  },
})`
  height: ${windowHeight * 0.3}px;
  width: 100%;
  padding: 20px;
  flex-direction: row;
  align-items: center;
`;

const Col = styled.View`
  flex: 1;
`;

const Row = styled.View`
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: 25px;
`;

const RightText = styled.Text`
  font-size: 18px;
  color: #333;
`;

const RightTextBold = styled(RightText)`
  font-weight: bold;
  text-align: right;
`;

const StyledButton = styled(CustomButton).attrs({
  style: {
    backgroundColor: '#007AFF',
  },
  textStyle: {
    color: '#fff',
  },
})``;
