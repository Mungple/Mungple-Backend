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
import DogInfoBox from '@/components/user/DogInfoBox';

const windowHeight = Dimensions.get('window').height;

const HomeScreen: React.FC = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const setWalkingStart = useAppStore(state => state.setWalkingStart);
  const [selectedPets, setSelectedPets] = useState<number[]>([]);
  const navigation =
    useNavigation<NativeStackNavigationProp<MapStackParamList>>();
  // const {explorationId, startAt} = useAppStore(state => state.exploration);

  const handleModalVisivle = () => {
    if (modalVisible) {
      setModalVisible(false);
    } else {
      setModalVisible(true);
    }
  };

  const handleWalkingStart = () => {
    setModalVisible(false);
    setWalkingStart(true);
    // const data = startWalk().then(response => console.log(response))
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

      <DogInfoBox />

      <CustomButton label="산책 시작하기" onPress={handleModalVisivle} />

      {/* 산책 시작 확인 모달 */}
      <CustomModal
        isWide={true}
        height={windowHeight * 0.7}
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}>
        <CustomModalHeader
          title="반려견 선택"
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
