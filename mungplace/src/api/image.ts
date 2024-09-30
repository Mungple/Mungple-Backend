import axiosInstance from './axios';

// 프로필 이미지를 추가하는 함수
const addImage = async (formData: FormData): Promise<string> => {
  try {
    const {data} = await axiosInstance.post('/users/image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data; charset=utf8',
      },
    });
    console.log('프로필 이미지 추가 완료');
    return data;
  } catch (error) {
    console.log('사진 등록 실패 :', error);
    throw error;
  }
};

// 프로필 이미지를 수정하는 함수
const editImage = async (body: FormData): Promise<string> => {
  const {data} = await axiosInstance.patch('/users/image', body, {
    headers: {
      'Content-Type': 'multipart/form-data; charset=utf8',
    },
  });
  return data;
};

// 반려견 프로필 이미지를 추가하는 함수
const addPetImage = async (body: FormData, petId?: number): Promise<string> => {
  if (petId) {
    const {data} = await axiosInstance.post(`/users/dogs/${petId}/images`, body, {
      headers: {
        'Content-Type': 'multipart/form-data; charset=utf8',
      },
    });
    return data;
  } else {
    console.log(`petId가 없습니다`)
    throw Error
  }
};

// 반려견 프로필 이미지를 수정하는 함수
const editPetImage = async (petId: number, body: FormData): Promise<string> => {
  const {data} = await axiosInstance.patch(
    `/users/dogs/${petId}/images`,
    body,
    {
      headers: {
        'Content-Type': 'multipart/form-data; charset=utf8',
      },
    },
  );
  return data;
};

export { addImage, addPetImage, editImage, editPetImage };

