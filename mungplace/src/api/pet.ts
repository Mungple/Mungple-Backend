import {RequestPetProfile, ResponsePetProfile} from '@/types';
import axiosInstance from './axios';

// 반려견 정보 등록 함수
const createPetProfile = async (JSON: string): Promise<void> => {
  try {
    const {data} = await axiosInstance.post(`/users/dogs`, JSON, {
      headers: {
        'Content-Type': `application/json; charset=utf8`,
      },
    });
    return data;
  } catch (error) {
    console.log('반려견 정보 등록 실패 :', error);
    throw error;
  }
};

// 반려견 정보 조회 함수
const getPetProfiles = async (userId: number): Promise<ResponsePetProfile[]> => {
  try {
    const {data} = await axiosInstance.get(`/users/${userId}/dogs`, {
      headers: {
        'Content-Type': `application/json; charset=utf8`,
      },
    });
    return data;
  } catch (error) {
    console.log('반려견 정보 등록 실패 :', error);
    throw error;
  }
};

// 반려견 정보 수정 함수
const editPetProfile = async (
  dogId: number,
  body: Partial<RequestPetProfile>,
): Promise<ResponsePetProfile[]> => {
  const {data} = await axiosInstance.patch(`/users/dogs/${dogId}`, body);
  return data;
};

// 반려견 정보 삭제 함수
const deletePetProfile = async (dogId: number): Promise<void> => {
  await axiosInstance.delete(`/users/dogs/${dogId}`);
};

// 반려견 기본 프로필 설정 함수
const setDefaultPetProfile = async (dogId: number): Promise<void> => {
  await axiosInstance.patch(`/users/dogs/${dogId}/default`);
};

export {
  createPetProfile,
  getPetProfiles,
  editPetProfile,
  deletePetProfile,
  setDefaultPetProfile,
};
