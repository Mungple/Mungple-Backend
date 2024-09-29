// components/EditProfileScreen.tsx
import React from 'react';
import { Alert, Keyboard } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import styled from 'styled-components/native';

import CustomButton from '@/components/common/CustomButton';
import EditProfileImageOption from '@/components/setting/EditProfileImageOption';
import { colors } from '@/constants';
import useImagePicker from '@/hooks/useImagePicker';
import useModal from '@/hooks/useModal';
import { useUserStore } from '@/state/useUserStore';

const EditProfileScreen = () => {
  const imageOption = useModal();
  const {imageName} = useUserStore(state => state.userData);

  // 이미지 선택 기능을 위한 커스텀 훅
  const imagePicker = useImagePicker({
    image: imageName ? `http://j11e106.p.ssafy.io:9000/images/${imageName}` : '',
    onSettled: () => {
      imageOption.hide();
    }
  });

  // 프로필 이미지 클릭 시 모달을 열고 키보드를 숨김
  const handlePressImage = () => {
    imageOption.show();
    Keyboard.dismiss();
  };

  const handleSubmit = () => {
    // 필요한 제출 로직을 여기에 구현하세요.
    Alert.alert('제출', '프로필이 성공적으로 업데이트되었습니다.');
  };

  return (
    <Container>
      {/* 프로필 이미지 영역 */}
      <ProfileContainer>
        <ImageContainer onPress={handlePressImage}>
          {imagePicker.imageName === ''
            ? <Ionicons name="camera-outline" size={40} color={colors.GRAY_400} />
            : <MyImage source={{ uri: imagePicker.imageName }} resizeMode="cover" />
          }
          {imagePicker.isUploading && (
            <LoadingOverlay>
              <LoadingIndicator />
            </LoadingOverlay>
          )}
        </ImageContainer>
      </ProfileContainer>

      {/* 제출 버튼 */}
      <SubmitButton 
        label='완료' 
        onPress={handleSubmit} 
        disabled={imagePicker.isUploading} 
      />

      {/* 프로필 이미지 수정 모달 옵션 */}
      <EditProfileImageOption
        isVisible={imageOption.isVisible}        // 모달이 보이는지 여부
        hideOption={imageOption.hide}            // 모달 숨기기 함수
        onChangeImage={imagePicker.handleChange} // 이미지 선택 후 동작 함수
      />
    </Container>
  );
}

const Container = styled.SafeAreaView`
  flex: 1;
  padding: 20px;
  justify-content: center;
  background-color: ${colors.WHITE};
`;

const ProfileContainer = styled.View`
  align-items: center;
  margin-top: 20px;
  margin-bottom: 40px;
`;

const MyImage = styled.Image`
  width: 150px;
  height: 150px;
  border-radius: 75px;
`;

const ImageContainer = styled.Pressable`
  width: 150px;
  height: 150px;
  border-radius: 75px;
  justify-content: center;
  align-items: center;
  border-color: ${colors.GRAY_300};
  border-width: 1px;
  overflow: hidden;
`;

const SubmitButton = styled(CustomButton)`
  margin-top: 20px;
`;

const LoadingOverlay = styled.View`
  position: absolute;
  width: 150px;
  height: 150px;
  border-radius: 75px;
  background-color: rgba(0, 0, 0, 0.5);
  justify-content: center;
  align-items: center;
`;

const LoadingIndicator = styled.ActivityIndicator.attrs({
  size: 'large',
  color: colors.WHITE,
})``;

export default EditProfileScreen;
