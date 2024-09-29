// hooks/useImagePicker.ts
import { useState } from 'react';
import { Alert } from 'react-native';
import ImagePicker, { Image as PickerImage } from 'react-native-image-crop-picker';

import { addImage } from '@/api';
import { getFormDataImage } from '@/utils';

interface UseImagePickerProps {
  image?: string;
  onSettled?: () => void;
}

// 이미지 선택 및 업로드를 관리하는 커스텀 훅
const useImagePicker = ({ image = '', onSettled }: UseImagePickerProps) => {
  const [imageName, setImageName] = useState<string>(image);
  const [isUploading, setIsUploading] = useState<boolean>(false);

  // 이미지 선택 및 업로드를 처리하는 함수
  const handleChange = async () => {
    try {
      const selectedImage: PickerImage = await ImagePicker.openPicker({
        mediaType: 'photo',
        cropping: true,
        cropperChooseText: '완료',
        cropperCancelText: '취소',
      });

      const formData = getFormDataImage('image', selectedImage);
      setIsUploading(true);

      const response = await addImage(formData);

      if (response && response.imageName) {
        setImageName(`http://j11e106.p.ssafy.io:9000/images/${response.imageName}`);
        Alert.alert('업로드 완료', '이미지 업로드가 완료되었습니다.');
        if (onSettled) onSettled();
      } else {
        throw new Error('이미지 업로드에 실패했습니다.');
      }
    } catch (error: any) {
      if (error.code !== 'E_PICKER_CANCELLED') {
        Alert.alert('이미지 선택 오류', '이미지를 선택하거나 업로드하지 못했습니다.');
      }
      console.error('이미지 업로드 오류:', error);
    } finally {
      setIsUploading(false);
    }
  };

  return {
    imageName,
    handleChange,
    isUploading,
  };
};

export default useImagePicker;
