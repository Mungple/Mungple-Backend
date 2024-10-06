// 1. 라이브러리 및 네이티브 기능
import React, { useState } from 'react';
import { Alert, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

// 2. API 호출
import { startWalk } from '@/api/walk';

// 3. 커스텀 컴포넌트
import PetList from '@/components/user/PetList';
import PetInfoBox from '@/components/user/PetInfoBox';
import CustomModal from '@/components/common/CustomModal';
import CustomButton from '@/components/common/CustomButton';
import CustomModalHeader from '@/components/common/CustomModalHeader';

// 4. 스타일 및 이미지
import * as HS from './HomeScreenStyle';
import dogMain from '@/assets/dog_main.png';

// 5. 상수 및 네비게이션
import { mapNavigations } from '@/constants';
import { MapStackParamList } from '@/navigations/stack/MapStackNavigator';

// 6. 상태 관리
import { useAppStore } from '@/state/useAppStore';
import { useUserStore } from '@/state/useUserStore';

// 7. 훅(Hooks)
import usePet from '@/hooks/queries/usePet';
import { calculateAge } from '@/hooks/usePetAge';
import useUserLocation from '@/hooks/useUserLocation';

const windowHeight = Dimensions.get('window').height;

const HomeScreen: React.FC = () => {
  // 펫 정보
  const { userId } = useUserStore.getState();
  const { useGetPet } = usePet();
  const { data: petData } = useGetPet(userId);
  const defaultPet = petData?.find((pet) => pet.isDefault === true);
  const { userLocation, isUserLocationError } = useUserLocation();
  const age = defaultPet ? calculateAge(defaultPet.birth) : undefined;

  // 산책
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedPets, setSelectedPets] = useState<number[]>([]);
  const setWalkingStart = useAppStore((state) => state.setWalkingStart);
  const setStartExplorate = useAppStore((state) => state.setStartExplorate);
  const navigation = useNavigation<NativeStackNavigationProp<MapStackParamList>>();

  // 산책 시작 모달
  const handleModalVisivle = () => {
    setModalVisible(!modalVisible);
  };

  // 반려견 선택 로직
  const handlePetSelect = (dogId: number) => {
    setSelectedPets((prev) =>
      prev.includes(dogId) ? prev.filter((id) => id !== dogId) : [...prev, dogId],
    );
  };

  // 산책 시작 함수
  const handleWalkingStart = async () => {
    if (!isUserLocationError && selectedPets.length > 0) {
      const walkData = JSON.stringify({
        lat: userLocation.latitude.toString(),
        lon: userLocation.longitude.toString(),
        dogIds: selectedPets,
      });

      setModalVisible(false);
      setWalkingStart(true);
      setStartExplorate(await startWalk(walkData));
      navigation.navigate(mapNavigations.WALKING);
    } else if (isUserLocationError) {
      Alert.alert('Error', '위치 권한을 허용해주세요');
    } else {
      Alert.alert('Error', '반려견을 선택해주세요');
    }
  };

  return (
    <HS.Container>
      <HS.ImageCard>
        <HS.Image
          source={
            defaultPet && defaultPet.photo
              ? { uri: `http://j11e106.p.ssafy.io:9000/images/${defaultPet.photo}` }
              : dogMain
          }></HS.Image>
      </HS.ImageCard>
      <PetInfoBox defaultPet={defaultPet} age={age} />
      <CustomButton label="산책 시작하기" onPress={handleModalVisivle} />
      {/* 산책 시작 확인 모달 */}
      <CustomModal
        isWide={true}
        height={windowHeight * 0.7}
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}>
        <CustomModalHeader title="반려견 선택" closeButton={handleModalVisivle} />
        <PetList selectedPets={selectedPets} homeScreenPress={handlePetSelect} />
        <HS.StartButton label="산책 시작하기" onPress={handleWalkingStart} />
      </CustomModal>
    </HS.Container>
  );
};

export default HomeScreen;
