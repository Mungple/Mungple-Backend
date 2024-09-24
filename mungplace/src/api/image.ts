import axiosInstance from './axios';

// 프로필 이미지를 추가하는 함수
const postImage = async (body: FormData): Promise<string> => {
  // 서버에 POST 요청을 보내고 응답 데이터에서 'data'를 추출
  const {data} = await axiosInstance.post('/users/images', body, {
    headers: {
      'Content-Type': 'multipart/form-data; charset=utf8', // 멀티파트 폼 데이터 헤더 설정
    },
  });
  return data; // 서버로부터 받은 데이터를 반환
};

// 프로필 이미지를 수정하는 함수
const editImage = async (body: FormData): Promise<string> => {
  const {data} = await axiosInstance.patch('/users/images', body, {
    headers: {
      'Content-Type': 'multipart/form-data; charset=utf8',
    },
  });
  return data;
};

// 반려견 프로필 이미지를 추가하는 함수
const postPetImage = async (dogId: number, body: FormData): Promise<string> => {
  const {data} = await axiosInstance.post(`/users/dogs/${dogId}/images`, body, {
    headers: {
      'Content-Type': 'multipart/form-data; charset=utf8',
    },
  });
  return data;
};

// 반려견 프로필 이미지를 수정하는 함수
const editPetImage = async (dogId: number, body: FormData): Promise<string> => {
  const {data} = await axiosInstance.patch(`/users/dogs/${dogId}/images`, body, {
    headers: {
      'Content-Type': 'multipart/form-data; charset=utf8',
    },
  });
  return data;
};

export {postImage, editImage, postPetImage, editPetImage};
