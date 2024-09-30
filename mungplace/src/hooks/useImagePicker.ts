// hooks/useImagePicker.ts
import {useEffect, useState} from 'react';
import {Alert} from 'react-native';
import ImagePicker, {Image as PickerImage} from 'react-native-image-crop-picker';

import {getFormDataImage} from '@/utils';

interface UseImagePickerProps {
  petId?: number;
  image?: string;
  onSettled?: () => void;
  uploadFunction: (formData: FormData, petId?: number) => Promise<string>;
}

// 이미지 선택 및 업로드를 관리하는 커스텀 훅
const useImagePicker = ({
  petId,
  image = '',
  onSettled,
  uploadFunction,
}: UseImagePickerProps) => {
  const [imageName, setImageName] = useState<string>(image);
  const [isUploading, setIsUploading] = useState<boolean>(false);

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
    setIsUploading(true);

    const upload = () => {
      if (petId) {
        return uploadFunction(formData, petId);
      } else {
        return uploadFunction(formData);
      }
    }
    const response = await upload()

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
    isUploading,
    handleChange,
  };
};

export default useImagePicker;
