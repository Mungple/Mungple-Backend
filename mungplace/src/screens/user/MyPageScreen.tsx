import React, {useState} from 'react';
import {Dimensions} from 'react-native';
import styled from 'styled-components/native';
import IonIcons from 'react-native-vector-icons/Ionicons';
import {NativeStackScreenProps} from '@react-navigation/native-stack';

import useAuth from '@/hooks/queries/useAuth';
import PetList from '@/components/user/PetList';
import {useUserStore} from '@/state/useUserStore';
import PetForm from '@/components/user/PetForm';
import useImagePicker from '@/hooks/useImagePicker';
import ProfileImage from '@/assets/profile-image.png';
import {colors, settingNavigations} from '@/constants';
import CustomCard from '@/components/common/CustomCard';
import CustomModal from '@/components/common/CustomModal';
import CustomHeader from '@/components/common/CustomHeader';
import CustomModalHeader from '@/components/common/CustomModalHeader';
import {SettingStackParamList} from '@/navigations/stack/SettingStackNavigator';

export type MyPageScreenProps = NativeStackScreenProps<
  SettingStackParamList,
  typeof settingNavigations.MY_PAGE
>;

const windowHeight = Dimensions.get('window').height;

const MyPageScreen: React.FC<MyPageScreenProps> = ({navigation}) => {
  // const imageOption = useModal();
  const {useGetProfile} = useAuth();
  const userId = useUserStore(state => state.userId);
  const [modalVisible, setModalVisible] = useState(false);
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

  const handleAddPet = () => {
    if (modalVisible) {
      setModalVisible(false);
    } else {
      setModalVisible(true);
    }
  };

  return (
    <Container>
      {/* 프로필 영역 */}
      <CustomHeader title="내 정보">
        <IonIcons
          name={'settings-outline'}
          size={32}
          color={colors.BLACK}
          onPress={handleSettingPress}
        />
      </CustomHeader>

      <ProfileCard onPress={handleProfilePress}>
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
        <InfoContainer>
          <Nickname>{nickname}</Nickname>
          <SecondaryInfo>128 포인트</SecondaryInfo>
        </InfoContainer>
      </ProfileCard>

      {/* 반려견 목록 */}
      <HeaderBox>
        <MenuText>나의 반려견</MenuText>
        <AddPetButton onPress={handleAddPet}>
          <AddPetText>등록</AddPetText>
        </AddPetButton>
      </HeaderBox>

      <PetListBox>
        <PetList navigation={navigation}/>
      </PetListBox>

      <CustomModal
        isWide={true}
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}>
        <CustomModalHeader title="반려견 등록" closeButton={handleAddPet} />
        <PetForm setModalVisible={setModalVisible} />
      </CustomModal>
    </Container>
  );
};

const Container = styled.SafeAreaView`
  background-color: ${colors.WHITE};
  align-items: center;
`;

const ProfileCard = styled(CustomCard)`
  width: 90%;
  margin: 20px;
  border-width: 1px;
  padding: 12px 20px;
  flex-direction: row;
  align-items: center;
  justify-content: space-around;
  border-color: ${colors.GRAY_200};
`;

const MyImage = styled.Image`
  width: 100%;
  height: 100%;
  border-radius: 75px;
`;

const ImageContainer = styled.View`
  width: 60px;
  height: 60px;
  border-radius: 30px;
`;

const HeaderBox = styled.View`
  padding: 0 20px;
  align-items: center;
  flex-direction: row;
  justify-content: center;
`;

const AddPetButton = styled.TouchableOpacity`
  padding: 10px 16px;
  border-radius: 8px;
  background-color: ${colors.ORANGE.BASE};
`;

const AddPetText = styled.Text`
  font-weight: bold;
  color: ${colors.WHITE};
`;

const MenuText = styled.Text`
  flex: 1;
  font-size: 18px;
  font-weight: bold;
  color: ${colors.BLACK};
`;

const PetListBox = styled.View`
  width: 100%;
  height: ${windowHeight * 0.7}px;
`;

const InfoContainer = styled.View`
  flex-direction: column;
`;

const Nickname = styled.Text`
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 8px;
  color: ${colors.BLACK};
`;

const SecondaryInfo = styled.Text`
  font-size: 14px;
  color: ${colors.GRAY_300};
`;

export default MyPageScreen;
