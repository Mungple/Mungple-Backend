import axiosInstance from './axios';

// 이미지를 업로드하는 함수
const uploadImages = async (body: FormData): Promise<string[]> => {
  // 서버에 POST 요청을 보내고 응답 데이터에서 'data'를 추출
  const {data} = await axiosInstance.post('/images', body, {
    headers: {
      'Content-Type': 'multipart/form-data', // 멀티파트 폼 데이터 헤더 설정
    },
  });

  return data; // 서버로부터 받은 데이터를 반환
};

export {uploadImages};
