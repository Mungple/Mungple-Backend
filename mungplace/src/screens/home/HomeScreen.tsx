import React, {useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';

import * as HS from './HomeScreenStyle';
import {useAppStore} from '@/state/useAppStore';
import {colors, mapNavigations} from '@/constants';
import {IonIcons} from 'react-native-vector-icons/Ionicons';
import CustomModal from '@/components/common/CustomModal';
import CustomButton from '@/components/common/CustomButton';
import {MapStackParamList} from '@/navigations/stack/MapStackNavigator';

const HomeScreen: React.FC = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const setWalkingStart = useAppStore(state => state.setWalkingStart);
  const navigation = useNavigation<NativeStackNavigationProp<MapStackParamList>>();

  const handleModalVisible = () => {
    setIsModalVisible(!isModalVisible);
  };

  const handleWalkingStart = () => {
    setWalkingStart(true);
    navigation.navigate(mapNavigations.WALKING);
  };

  return (
    <HS.Container>
      <HS.ImageCard />

      <HS.DogInfo>
        <HS.Col>
          <HS.HeaderText>반려견 정보</HS.HeaderText>
        </HS.Col>
        <HS.Col>
          <HS.Row>
            <HS.RightText>성별</HS.RightText>
            <HS.RightTextBold>남아</HS.RightTextBold>
          </HS.Row>
          <HS.Row>
            <HS.RightText>나이</HS.RightText>
            <HS.RightTextBold>36개월</HS.RightTextBold>
          </HS.Row>
          <HS.Row>
            <HS.RightText>몸무게</HS.RightText>
            <HS.RightTextBold>2kg</HS.RightTextBold>
          </HS.Row>
        </HS.Col>
      </HS.DogInfo>

      <CustomButton label="산책 시작하기" onPress={handleModalVisible} />

      {/* 산책 시작 확인 모달 */}
      <CustomModal modalVisible={isModalVisible}>
        {/* 상단 헤더 */}
        <HS.HeaderContainer>
          <HS.MenuText>반려견 선택</HS.MenuText>
          <HS.CloseButton onPress={handleModalVisible}>
            {/* <IonIcons name={'close'} size={32} color={colors.BLACK} /> */}
          </HS.CloseButton>
        </HS.HeaderContainer>

        <CustomButton label="산책 시작하기" onPress={handleWalkingStart} />
      </CustomModal>
    </HS.Container>
  );
};

export default HomeScreen;
