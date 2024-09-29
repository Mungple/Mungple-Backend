import { useState } from 'react';
import { Alert } from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';

import { getFormDataImage } from '@/utils';
import useMutateImages from './queries/useMutateImages';

interface UseImagePickerProps {
  image: string;
  onSettled?: () => void;
}

// 이미지 선택 및 업로드를 관리하는 커스텀 훅
const useImagePicker = ({image = '', onSettled}: UseImagePickerProps) => {
  const uploadImage = useMutateImages();
  const [imageName, setImageName] = useState<string>(image);

  // 이미지 선택 및 업로드를 처리하는 함수
  const handleChange = () => {
    ImagePicker.openPicker({
      mediaType: 'photo',
      multiple: false,
      includeBase64: true,
      maxFiles: 1,
      cropperChooseText: '완료',
      cropperCancelText: '취소',
    })
      .then(images => {
        const selectedImage = images;
        const formData = getFormDataImage('images', selectedImage);

        uploadImage.mutate(formData, {
          onSuccess: data => setImageName(String(data)),
          onSettled: () => onSettled && onSettled(),
        });
      })
      .catch(error => {
        if (error.code !== 'E_PICKER_CANCELLED') {
          Alert.alert('이미지 선택 오류', '이미지를 선택하지 못했습니다.');
        }
      });
  };

  // 훅에서 제공하는 값과 함수들 반환
  return {
    imageName,                           // 현재 이미지 URI 배열
    handleChange,                        // 이미지 선택 및 업로드 함수
    isUploading: uploadImage.isPending, // 이미지 업로드 중인지 여부
  };
};

export default useImagePicker;
