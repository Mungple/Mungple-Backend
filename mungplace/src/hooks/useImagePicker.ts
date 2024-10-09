// hooks/useImagePicker.ts
import { useEffect, useState } from 'react';
import { Alert } from 'react-native';
import ImagePicker, { Image as PickerImage } from 'react-native-image-crop-picker';

import { getFormDataImage } from '@/utils';
import useImage from './queries/useImage';

type UseImagePickerProps = {
  petId?: number;
  image?: string;
  onSettled?: () => void;
};

// 이미지 선택 및 업로드를 관리하는 커스텀 훅
const useImagePicker = ({ petId, image = '', onSettled }: UseImagePickerProps) => {
  const [imageName, setImageName] = useState<string>(image);
  const { imageMutation, petImageMutation } = useImage();

  useEffect(() => {
    setImageName(image);
  }, [image]);

  const handleChange = async () => {
    // 이미지 선택
    const selectedImage: PickerImage = await ImagePicker.openPicker({
      mediaType: 'photo',
      cropping: true,
      cropperChooseText: '완료',
      cropperCancelText: '취소',
    });

    // 이미지 업로드
    const formData = getFormDataImage('image', selectedImage);

    const upload = () => {
      return petId
        ? petImageMutation.mutateAsync([formData, petId])
        : imageMutation.mutateAsync(formData);
    };
    const response = await upload();

    if (response) {
      setImageName(`http://j11e106.p.ssafy.io:9000/images/${imageName}`);
      Alert.alert('업로드 완료', '이미지 업로드가 완료되었습니다.');
      if (onSettled) onSettled();
    } else {
      throw new Error('이미지 업로드에 실패했습니다.');
    }
  };

  return {
    imageName,
    handleChange,
  };
};

export default useImagePicker;
