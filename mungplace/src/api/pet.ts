import axiosInstance from './axios';

// 반려견 타입 정의
type RequestPetProfile = {
  petName: string;
  petGender: 'Male' | 'Female';
  petWeight: number;
  petBirth: string;
};

type ResponsePetProfile = {
  id: number;
  default: boolean;
  name: string;
  gender: 'Male' | 'Female';
  weight: number;
  birth: string;
  photoId: string;
};

// 반려견 정보 등록 함수
const createPetProfile = async (body: RequestPetProfile): Promise<ResponsePetProfile> => {
  const { data } = await axiosInstance.post(`/users/dogs`, body);
  return data;
};

// 반려견 정보 조회 함수
const getPetProfiles = async (): Promise<ResponsePetProfile> => {
  const { data } = await axiosInstance.get(`/users/dogs`);
  return data;
};

// 타사용자 반려견 정보 조회 함수
const getOtherPetProfiles = async (userId: number): Promise<ResponsePetProfile> => {
  const { data } = await axiosInstance.get(`/users/${userId}/dogs`);
  return data;
};

// 반려견 정보 수정 함수
const editPetProfile = async (dogId: number, body: Partial<RequestPetProfile>): Promise<ResponsePetProfile> => {
  const { data } = await axiosInstance.patch(`/users/dogs/${dogId}`, body);
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

export {createPetProfile, getPetProfiles, editPetProfile, deletePetProfile, setDefaultPetProfile, getOtherPetProfiles};
export type {RequestPetProfile, ResponsePetProfile};
