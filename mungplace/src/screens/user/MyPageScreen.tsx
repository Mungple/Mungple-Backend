import React, {useState} from 'react';
import IonIcons from 'react-native-vector-icons/Ionicons';
import {NativeStackScreenProps} from '@react-navigation/native-stack';

import * as MS from './MyPageScreenStyle';
import useAuth from '@/hooks/queries/useAuth';
import {useUserStore} from '@/state/useUserStore';
import CreatePet from '@/components/user/CreatePet';
import {colors, settingNavigations} from '@/constants';
import CustomModal from '@/components/common/CustomModal';
import CustomHeader from '@/components/common/CustomHeader';
import CustomModalHeader from '@/components/common/CustomModalHeader';
import {SettingStackParamList} from '@/navigations/stack/SettingStackNavigator';

type MyPageScreenProps = NativeStackScreenProps<
  SettingStackParamList,
  typeof settingNavigations.MY_PAGE
>;

const MyPageScreen: React.FC<MyPageScreenProps> = ({navigation}) => {
  // const imageOption = useModal();
  const {useGetProfile} = useAuth();
  const {userId, petData} = useUserStore.getState();
  const [currentPetData, setCurrentPetData] = useState({});
  const [modalAddVisible, setModalAddVisible] = useState(false);
  const [modalEditVisible, setModalEditVisible] = useState(false);
  const nickname = userId ? useGetProfile(userId).data?.nickname : '로그인 해주세요';

  // 이미지 선택 기능을 위한 커스텀 훅
  // const imagePicker = useImagePicker({
  //   initialImages: imageName ? [{uri: imageName}] : [],
  //   mode: 'single',
  //   onSettled: imageOption.hide,
  // });

  const handleSettingPress = () => {
    navigation.navigate(settingNavigations.SETTING);
  };

  const handleProfilePress = () => {
    navigation.navigate(settingNavigations.EDIT_PROFILE);
  };

  const handlePetSelect = (petId: number) => {
    const currentPetData = petData.map((pet) => pet.id === petId)
    setCurrentPetData(currentPetData); // 선택한 반려견의 데이터 저장
    setModalEditVisible(true);  // 수정 모달 열기
  };

  const handleAddPetButtonPress = () => {
    if (modalAddVisible) {
      setModalAddVisible(false);
    } else {
      setModalAddVisible(true);
    }
  };

  const handleEditPetButtonPress = () => {
    if (modalEditVisible) {
      setModalEditVisible(false);
    } else {
      setModalEditVisible(true);
    }
  };

  return (
    <MS.Container>
      {/* 프로필 영역 */}
      <CustomHeader title="내 정보">
        <IonIcons
          name={'settings-outline'}
          size={32}
          color={colors.BLACK}
          onPress={handleSettingPress}
        />
      </CustomHeader>
      <MS.ProfileCard onPress={handleProfilePress}>
        {/* <ImageContainer>
          {imagePicker.imageNames.length === 0 ? (
            <MyImage source={ProfileImage} />
          ) : (
            <MyImage
              source={{
                uri: `http://10.0.2.2:3030/${imagePicker.imageNames[0]?.uri}`,
              }}
              resizeMode="cover"
            />
          )}
        </ImageContainer> */}
        <MS.InfoContainer>
          <MS.Nickname>{nickname}</MS.Nickname>
          <MS.SecondaryInfo>128 포인트</MS.SecondaryInfo>
        </MS.InfoContainer>
      </MS.ProfileCard>

      {/* 반려견 목록 */}
      <MS.ListContainer>
        <MS.MenuText>나의 반려견</MS.MenuText>
        <MS.CreatePetButton onPress={handleAddPetButtonPress}>
          <MS.CreatePetText>등록</MS.CreatePetText>
        </MS.CreatePetButton>
      </MS.ListContainer>
      <MS.MyPetListContainer>
        <MS.MyPetList handlePetSelect={handlePetSelect} />
      </MS.MyPetListContainer>

      {/* 반려견 등록 모달 */}
      <CustomModal
        isWide={true}
        modalVisible={modalAddVisible}
        setModalVisible={setModalAddVisible}>
        <CustomModalHeader
          title="반려견 등록"
          closeButton={handleAddPetButtonPress}
        />
        <CreatePet setModalVisible={setModalAddVisible} />
      </CustomModal>

      {/* 빈려견 정보 수정 모달 */}
      <CustomModal
        isWide={true}
        modalVisible={modalEditVisible}
        setModalVisible={setModalEditVisible}>
        <CustomModalHeader
          title="반려견 정보 수정"
          closeButton={handleEditPetButtonPress}
        />
        <CreatePet setModalVisible={setModalEditVisible} isEdit={true} petData={currentPetData}/>
      </CustomModal>
    </MS.Container>
  );
};

export default MyPageScreen;
