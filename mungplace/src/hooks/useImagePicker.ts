import {useState} from 'react';
import {Alert} from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';

import type {ImageUri} from '@/types';
import {getFormDataImages} from '@/utils';
import useMutateImages from './queries/useMutateImages';

interface UseImagePickerProps {
  initialImages: ImageUri[];    // 초기 이미지 URI 배열
  mode?: 'multiple' | 'single'; // 이미지 선택 모드 (다중 또는 단일)
  onSettled?: () => void;       // 이미지 업로드 완료 후 호출되는 콜백 함수
}

// 이미지 선택 및 업로드를 관리하는 커스텀 훅
const useImagePicker = ({
  initialImages = [],
  mode = 'multiple',
  onSettled,
}: UseImagePickerProps) => {
  const uploadImages = useMutateImages()
  const [imageUris, setImageUris] = useState(initialImages)

  // 새로운 이미지 URI들을 추가하는 함수
  const addImageUris = (uris: string[]) => {
    if (imageUris.length + uris.length > 5) {
      Alert.alert('이미지 개수 초과', '추가 가능한 이미지는 최대 5개입니다.');
      return;
    }
    setImageUris(prev => [...prev, ...uris.map(uri => ({uri}))]);
  }

  // 이미지 URI를 교체하는 함수 (단일 선택 모드에서 사용)
  const replaceImageUri = (uris: string[]) => {
    if (uris.length > 1) {
      Alert.alert('이미지 개수 초과', '추가 가능한 이미지는 최대 1개입니다.');
      return;
    }
    setImageUris([...uris.map(uri => ({uri}))]);
  };

  // 특정 이미지 URI를 삭제하는 함수
  const deleteImageUri = (uri: string) => {
    const newImageUris = imageUris.filter(image => image.uri !== uri);
    setImageUris(newImageUris);
  };

  // 이미지 URI의 순서를 변경하는 함수
  const changeImageUrisOrder = (fromIndex: number, toIndex: number) => {
    const copyImageUris = [...imageUris];
    const [removedImage] = copyImageUris.splice(fromIndex, 1);
    copyImageUris.splice(toIndex, 0, removedImage);
    setImageUris(copyImageUris);
  };

  // 이미지 선택 및 업로드를 처리하는 함수
  const handleChange = () => {
    ImagePicker.openPicker({
      mediaType: 'photo',
      multiple: true,
      includeBase64: true,
      maxFiles: mode === 'multiple' ? 5 : 1,
      cropperChooseText: '완료',
      cropperCancelText: '취소',
    })
      .then(images => {
        // 선택한 이미지를 FormData로 변환
        const formData = getFormDataImages('images', images)

        // 이미지 업로드
        uploadImages.mutate(formData, {
          // 업로드 성공 시 상태 업데이트
          onSuccess: data => mode === 'multiple' ? addImageUris(data) : replaceImageUri(data),
          // 업로드 완료 후 콜백 함수 호출
          onSettled: () => onSettled && onSettled(),
        });
      })
      .catch(error => {
        // 사용자가 취소한 에러가 아닌 경우
        if (error.code !== 'E_PICKER_CANCELLED') {
          // Error message
        }
      });
    
      // 훅에서 제공하는 값과 함수들 반환
      return {
        imageUris,                           // 현재 이미지 URI 배열
        handleChange,                        // 이미지 선택 및 업로드 함수
        delete: deleteImageUri,              // 이미지 삭제 함수
        changeOrder: changeImageUrisOrder,   // 이미지 순서 변경 함수
        isUploading: uploadImages.isPending, // 이미지 업로드 중인지 여부
      };
  };
}

export default useImagePicker;
