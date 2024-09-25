import React, {useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';

import * as HS from './HomeScreenStyle';
import {Dimensions} from 'react-native';
import PetList from '@/components/user/PetList';
import {useAppStore} from '@/state/useAppStore';
import {mapNavigations} from '@/constants';
import CustomModal from '@/components/common/CustomModal';
import CustomButton from '@/components/common/CustomButton';
import {MapStackParamList} from '@/navigations/stack/MapStackNavigator';
import CustomModalHeader from '@/components/common/CustomModalHeader';

const windowHeight = Dimensions.get('window').height;

const HomeScreen: React.FC = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const setWalkingStart = useAppStore(state => state.setWalkingStart);
  const [selectedPets, setSelectedPets] = useState<number[]>([]);
  const navigation = useNavigation<NativeStackNavigationProp<MapStackParamList>>();


  const handleModalVisivle = () => {
    if (modalVisible) {
      setModalVisible(false)
    } else {
      setModalVisible(true)
    }
  }

  const handleWalkingStart = () => {
    setModalVisible(false);
    setWalkingStart(true);
    navigation.navigate(mapNavigations.WALKING);
  };

  const handlePetSelect = (dogId: number) => {
    setSelectedPets(prev =>
      prev.includes(dogId) ? prev.filter(id => id !== dogId) : [...prev, dogId],
    );
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

      <CustomButton label="산책 시작하기" onPress={handleModalVisivle} />

      {/* 산책 시작 확인 모달 */}
      <CustomModal
        isWide={true}
        height={windowHeight * 0.7}
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}>
        <CustomModalHeader
          title='반려견 선택'
          closeButton={handleModalVisivle}
        />
        <PetList selectedPets={selectedPets} handlePetSelect={handlePetSelect}>
          <CustomButton label="산책 시작하기" onPress={handleWalkingStart} />
        </PetList>
      </CustomModal>
    </HS.Container>
  );
};

export default HomeScreen;
