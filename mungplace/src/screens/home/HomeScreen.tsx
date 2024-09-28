import React, {useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';

import {startWalk} from '@/api/walk';
import * as HS from './HomeScreenStyle';
import {mapNavigations} from '@/constants';
import {Alert, Dimensions} from 'react-native';
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
  const setStartExplorate = useAppStore(state => state.setStartExplorate);
  const navigation = useNavigation<NativeStackNavigationProp<MapStackParamList>>();

  // 산책 시작 모달
  const handleModalVisivle = () => {
    setModalVisible(!modalVisible);
  };

  // 반려견 선택 로직
  const handlePetSelect = (dogId: number) => {
    setSelectedPets(prev =>
      prev.includes(dogId) ? prev.filter(id => id !== dogId) : [...prev, dogId],
    );
  };

  // 산책 시작 함수
  const handleWalkingStart = async () => {
    if (!isUserLocationError && selectedPets.length > 0) {
      const walkData = JSON.stringify({
        latitude: userLocation.latitude.toString(),
        longitude: userLocation.longitude.toString(),
        dogIds: selectedPets,
      });

      setModalVisible(false);
      setWalkingStart(true);
      setStartExplorate(await startWalk(walkData));
      console.log('산책 시작')
      console.log(useAppStore.getState().startExplorate)
      navigation.navigate(mapNavigations.WALKING);
    } else if (isUserLocationError) {
      Alert.alert('Error', '위치 권한을 허용해주세요');
    } else {
      Alert.alert('Error', '반려견을 선택해주세요');
    }
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
