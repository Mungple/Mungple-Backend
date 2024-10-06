import axiosInstance from './axios';

// 프로필 사진을 등록하는 함수
const addImage = async (formData: FormData): Promise<string> => {
  try {
    const { data } = await axiosInstance.post('/users/image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data; charset=utf8',
      },
    });
    console.log('프로필 사진 등록 완료');
    return data;
  } catch (error) {
    console.log('프로필 사진 등록 실패 :', error);
    throw error;
  }
};

// 반려견 프로필 사진을 등록하는 함수
const addPetImage = async (body: FormData, petId?: number): Promise<string> => {
  if (!petId) {
    console.log(`petId가 없습니다`);
    throw Error;
  }
  try {
    const { data } = await axiosInstance.post(`/users/dogs/${petId}/images`, body, {
      headers: {
        'Content-Type': 'multipart/form-data; charset=utf8',
      },
    });
    console.log('반려견 사진 등록 완료');
    return data;
  } catch (error) {
    console.log('반려견 사진 등록 실패 :', error);
    throw Error;
  }
};

export { addImage, addPetImage };
