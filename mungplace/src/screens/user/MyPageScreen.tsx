import React from 'react';
import {Image, Text} from 'react-native';
import styled from 'styled-components/native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';

import useModal from '@/hooks/useModal';
import useAuth from '@/hooks/queries/useAuth';
import useImagePicker from '@/hooks/useImagePicker';
import {colors, settingNavigations} from '@/constants';
import CustomButton from '@/components/common/CustomButton';
import {SettingStackParamList} from '@/navigations/stack/SettingStackNavigator';

type MyPageScreenProps = NativeStackScreenProps<SettingStackParamList, typeof settingNavigations.MY_PAGE>;

const MyPageScreen: React.FC<MyPageScreenProps> = ({navigation}) => {
  const imageOption = useModal();
  const {getProfileQuery, profileMutation} = useAuth();
  const {nickname = '닉네임', imageUri} = getProfileQuery.data || {};

  // 이미지 선택 기능을 위한 커스텀 훅
  const imagePicker = useImagePicker({
    initialImages: imageUri ? [{uri: imageUri}] : [],
    mode: 'single',
    onSettled: imageOption.hide,
  });

  return (
    <Container>
      <InnerContainer>
        <Section>
          {/* 프로필 이미지 영역 */}
          <ProfileContainer>
            <ImageContainer>
              {/* 이미지가 없고, 카카오 프로필 이미지도 없을 때 기본 아이콘 표시 */}
              {imagePicker.imageUris.length === 0 && (
                <MyImage source={require('@/assets/profile-image.png')} />
              )}
              {/* 선택한 이미지가 있을 때 해당 이미지 표시 */}
              {imagePicker.imageUris.length > 0 && (
                <MyImage source={{uri: `http://10.0.2.2:3030/${imagePicker.imageUris[0]?.uri}`}} resizeMode="cover" />
              )}
            </ImageContainer>
          </ProfileContainer>

          <Text>{nickname}</Text>
        </Section>

        <Section>
          <Text>반려견 목록</Text>
          <Text>반려견1</Text>
          <Text>반려견2</Text>
        </Section>
        <CustomButton
          label="반려견 상세"
          onPress={() => navigation.navigate(settingNavigations.PET_DETAIL)}
        />
        <CustomButton
          label="설정"
          onPress={() => navigation.navigate(settingNavigations.SETTING)}
        />
        <CustomButton
          label="프로필 편집"
          onPress={() => navigation.navigate(settingNavigations.EDIT_PROFILE)}
        />
        <CustomButton label="로그아웃" onPress={() => {}} />
      </InnerContainer>
    </Container>
  );
};

const Container = styled.SafeAreaView`
  flex: 1;
  padding: 20px;
  align-items: center;
  justify-content: center;
`;

const InnerContainer = styled.View`
  gap: 20px;
`;

const ProfileContainer = styled.View`
  align-items: center;
  margin-top: 20px;
  margin-bottom: 40px;
`;

const MyImage = styled.Image`
  width: 100%;
  height: 100%;
  border-radius: 75px;
`;

const ImageContainer = styled.Pressable`
  width: 150px;
  height: 150px;
  border-radius: 75px;
  justify-content: center;
  align-items: center;
`;

const Section = styled.View`
  align-items: center;
  justify-content: center;
`;


export default MyPageScreen;
