import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import { Dimensions, Image as RNImage, Text } from 'react-native';
import IonIcons from 'react-native-vector-icons/Ionicons';
import styled from 'styled-components/native';

import DefaultImage from '@/assets/profile-image.png';
import CustomCard from '@/components/common/CustomCard';
import CustomHeader from '@/components/common/CustomHeader';
import CustomModal from '@/components/common/CustomModal';
import CustomModalHeader from '@/components/common/CustomModalHeader';
import PetForm from '@/components/user/PetForm';
import PetList from '@/components/user/PetList';
import { colors, settingNavigations } from '@/constants';
import useAuth from '@/hooks/queries/useAuth';
import { SettingStackParamList } from '@/navigations/stack/SettingStackNavigator';
import { useUserStore } from '@/state/useUserStore';

export type MyPageScreenProps = NativeStackScreenProps<
  SettingStackParamList,
  typeof settingNavigations.MY_PAGE
>;

const windowHeight = Dimensions.get('window').height;

const MyPageScreen: React.FC<MyPageScreenProps> = ({navigation}) => {
  const userId = useUserStore(state => state.userId);
  const {useGetProfile} = useAuth();
  const userData = useUserStore(state => state.userData);
  const setUserData = useUserStore(state => state.setUserData);
  const [modalVisible, setModalVisible] = useState(false);
  
  if (userId) {
    const {data} = useGetProfile(userId);
    if (data) {
      setUserData(data);
    }
  }

  const handleSettingPress = () => {
    navigation.navigate(settingNavigations.SETTING);
  };

  const handleProfilePress = () => {
    navigation.navigate(settingNavigations.EDIT_PROFILE);
  };

  const handleAddPet = () => {
    setModalVisible(prev => !prev);
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
        <Image
          source={userData.imageName ? {uri: userData.imageName} : DefaultImage}
        />
        <Context>
          <Title>{userData.nickname}</Title>
          <Text>128 포인트</Text>
        </Context>
      </ProfileCard>

      {/* 반려견 목록 */}
      <HeaderBox>
        <MenuText>나의 반려견</MenuText>
        <AddPetButton onPress={handleAddPet}>
          <AddPetText>등록</AddPetText>
        </AddPetButton>
      </HeaderBox>

      <PetListBox>
        <PetList navigation={navigation} />
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
  flex: 1;
  align-items: center;
  background-color: ${colors.WHITE};
`;

const ProfileCard = styled(CustomCard)`
  width: 90%;
  margin: 20px;
  border-width: 1px;
  padding: 13px 20px;
  align-items: center;
  flex-direction: row;
  justify-content: space-around;
  border-color: ${colors.GRAY_200};
`;

const Image = styled(RNImage)`
  width: 70px;
  height: 70px;
  border-radius: 35px;
`;

const Context = styled.View`
  gap: 10px;
  flex-direction: column;
`;

const Title = styled.Text`
  font-size: 18px;
  font-weight: bold;
  color: ${colors.BLACK};
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

export default MyPageScreen;
