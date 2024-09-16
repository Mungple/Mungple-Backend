import React from 'react';
import {Keyboard, Pressable} from 'react-native';
import styled from 'styled-components/native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';

import {colors} from '@/constants';
import useForm from '@/hooks/useForm';
import useModal from '@/hooks/useModal';
import {validateInputUser} from '@/utils';
import useAuth from '@/hooks/queries/useAuth';
import useImagePicker from '@/hooks/useImagePicker';
import Ionicons from 'react-native-vector-icons/Ionicons';
import CustomInputField from '@/components/common/CustomInputField';
import {SettingStackParamList} from '@/navigations/stack/SettingStackNavigator';
import EditProfileImageOption from '@/components/setting/EditProfileImageOption';

type EditProfileScreenProps = NativeStackScreenProps<SettingStackParamList>;

function EditProfileScreen({navigation}: EditProfileScreenProps) {
  const imageOption = useModal();
  const {getProfileQuery, profileMutation} = useAuth();
  const {nickname, imageUri, kakaoImageUri} = getProfileQuery.data || {};

  const imagePicker = useImagePicker({
    initialImages: imageUri ? [{uri: imageUri}] : [],
    mode: 'single',
    onSettled: imageOption.hide,
  });

  const editProfile = useForm({
    initialValue: {nickname: nickname ?? ''},
    validate: validateInputUser,
  });

  const handlePressImage = () => {
    imageOption.show();
    Keyboard.dismiss();
  };

  return (
    <Container>
      <ProfileContainer>
        <ImageContainer onPress={handlePressImage}>
          {imagePicker.imageUris.length === 0 && !kakaoImageUri && (
            <Ionicons name="camera-outline" size={30} color={colors.GRAY_300} />
          )}
          {imagePicker.imageUris.length === 0 && kakaoImageUri && (
            <MyImage source={{uri: `http://10.0.2.2:3030/${kakaoImageUri}`}} resizeMode="cover" />
          )}
          {imagePicker.imageUris.length > 0 && (
            <MyImage source={{uri: `http://10.0.2.2:3030/${imagePicker.imageUris[0]?.uri}`}} resizeMode="cover" />
          )}
        </ImageContainer>
      </ProfileContainer>

      <CustomInputField
        {...editProfile.getTextInputProps('nickname')}
        error={editProfile.errors.nickname}
        touched={editProfile.touched.nickname}
        placeholder="닉네임을 입력해주세요."
      />

      <EditProfileImageOption
        isVisible={imageOption.isVisible}
        hideOption={imageOption.hide}
        onChangeImage={imagePicker.handleChange}
      />
    </Container>
  );
}

const Container = styled.SafeAreaView`
  flex: 1;
  padding: 20px;
  justify-content: center;
`;

const ProfileContainer = styled.View`
  align-items: center;
  margin-top: 20px;
  margin-bottom: 40px;
`;

const MyImage = styled.Image`
  width: 100%;
  height: 100%;
  border-radius: 50px;
`;

const ImageContainer = styled.Pressable`
  width: 100px;
  height: 100px;
  border-radius: 50px;
  justify-content: center;
  align-items: center;
  border-color: ${colors.GRAY_300};
  border-width: 1px;
`;


export default EditProfileScreen;
