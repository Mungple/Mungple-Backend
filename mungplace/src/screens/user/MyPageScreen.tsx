import React, { useEffect, useState } from 'react';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Image as RNImage } from 'react-native';
import styled from 'styled-components/native';

import useAuth from '@/hooks/queries/useAuth';
import PetForm from '@/components/user/PetForm';
import PetList from '@/components/user/PetList';
import { useUserStore } from '@/state/useUserStore';
import DefaultImage from '@/assets/profile-image.png';
import { colors, settingNavigations } from '@/constants';
import CustomCard from '@/components/common/CustomCard';
import CustomModal from '@/components/common/CustomModal';
import CustomText from '@/components/common/CustomText';
import CustomModalHeader from '@/components/common/CustomModalHeader';
import { SettingStackParamList } from '@/navigations/stack/SettingStackNavigator';
import usePet from '@/hooks/queries/usePet';

export type MyPageScreenProps = NativeStackScreenProps<
  SettingStackParamList,
  typeof settingNavigations.MY_PAGE
>;

const MyPageScreen: React.FC<MyPageScreenProps> = ({ navigation }) => {
  const { useGetPet } = usePet();
  const userId = useUserStore((state) => state.userId);
  const { data: petData } = useGetPet(userId);
  const userData = useUserStore((state) => state.userData);
  const defaultPet = petData?.find((pet) => pet.isDefault === true);
  const setUserData = useUserStore((state) => state.setUserData);
  const [modalVisible, setModalVisible] = useState(false);
  const { useGetProfile } = useAuth();
  const { data } = useGetProfile(userId);

  useEffect(() => {
    if (data) {
      setUserData(data);
    }
  }, [data]);

  const handleAddPet = () => {
    setModalVisible((prev) => !prev);
  };

  return (
    <Container>
      <ProfileCard>
        <Image
          source={
            userData.imageName
              ? { uri: `http://j11e106.p.ssafy.io:9000/images/${userData.imageName}` }
              : DefaultImage
          }
        />
        <Context>
          <CustomText fontWeight="bold" fontSize={18}>
            {userData.nickname}
          </CustomText>
          <CustomText color={colors.GRAY_200}>대표 반려견 | {defaultPet?.name}</CustomText>
        </Context>
      </ProfileCard>
      {/* 반려견 목록 */}
      <HeaderBox>
        <MenuBox>
          <CustomText fontWeight="bold" fontSize={18}>
            나의 반려견
          </CustomText>
        </MenuBox>
        <AddPetButton onPress={handleAddPet}>
          <CustomText fontWeight="bold" fontSize={18} color={colors.WHITE}>
            등록
          </CustomText>
        </AddPetButton>
      </HeaderBox>
      <PetList navigation={navigation} />
      <CustomModal isWide={true} modalVisible={modalVisible} setModalVisible={setModalVisible}>
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
  border-color: ${colors.GRAY_100};
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

const MenuBox = styled.View`
  flex: 1;
`;

export default MyPageScreen;
