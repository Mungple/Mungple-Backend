import React from 'react';
import { View } from 'react-native';

interface EditProfileImageOptionProps {
  isVisible: boolean;
  hideOption: () => void;
  onChangeImage: () => void;
}

function EditProfileImageOption({
  isVisible,
  hideOption,
  onChangeImage,
}: EditProfileImageOptionProps) {
  return (
    <View></View>
  );
}

export default EditProfileImageOption;
