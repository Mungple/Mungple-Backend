import type {Image} from 'react-native-image-crop-picker';

// 이미지 배열을 FormData로 변환하는 함수
function getFormDataImages(key: string = 'images', images: Image[]) {
  const formData = new FormData();

  images.forEach(({path, mime}) => {
    const file = {
      uri: path,                   // 이미지의 경로 (URI)
      type: mime,                  // 이미지의 MIME 타입 (예: 'image/jpeg')
      name: path.split('/').pop(), // 파일 이름 추출
    };

    // FormData에 파일 추가
    formData.append(key, file);
  });

  return formData;
}

export {getFormDataImages};
