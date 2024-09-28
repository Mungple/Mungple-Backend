import React, {useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';

import * as HS from './HomeScreenStyle';
import {Dimensions} from 'react-native';
import {mapNavigations} from '@/constants';
import PetList from '@/components/user/PetList';
import {useAppStore} from '@/state/useAppStore';
import DogInfoBox from '@/components/user/DogInfoBox';
import useUserLocation from '@/hooks/useUserLocation';
import CustomModal from '@/components/common/CustomModal';
import CustomButton from '@/components/common/CustomButton';
import CustomModalHeader from '@/components/common/CustomModalHeader';
import {MapStackParamList} from '@/navigations/stack/MapStackNavigator';

const windowHeight = Dimensions.get('window').height;

const HomeScreen: React.FC = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const {userLocation, isUserLocationError} = useUserLocation();
  const [selectedPets, setSelectedPets] = useState<number[]>([]);
  const setWalkingStart = useAppStore(state => state.setWalkingStart);
  const navigation = useNavigation<NativeStackNavigationProp<MapStackParamList>>();

  // 산책 시작 모달
  const handleModalVisivle = () => {
    setModalVisible(!modalVisible);
  };

  // 산책 시작 함수
  const handleWalkingStart = () => {
    if (!isUserLocationError && selectedPets.length > 0) {
      const walkData = {
        latitude: userLocation.latitude.toString(),
        longitude: userLocation.longitude.toString(),
        dogIds: selectedPets,
      };

      console.log(JSON.stringify(walkData));
    }

    setModalVisible(false);
    setWalkingStart(true);
    navigation.navigate(mapNavigations.WALKING);
  };

  // 반려견 선택 로직
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
