import type { Image } from 'react-native-image-crop-picker';

// 단일 이미지를 FormData로 변환하는 함수
function getFormDataImage(key: string = 'images', image: Image) {
  const formData = new FormData();

  const { path, mime } = image;
  const file = {
    uri: path, // 이미지의 경로 (URI)
    type: mime, // 이미지의 MIME 타입 (예: 'image/jpeg')
    name: path.split('/').pop() || 'image.jpg', // 파일 이름 추출 (기본값 설정)
  };

  // FormData에 파일 추가
  formData.append(key, file);

  return formData;
}

export { getFormDataImage };

