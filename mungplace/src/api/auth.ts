import axiosInstance from './axios';
import {getEncryptStorage} from '@/utils';
import type {Profile} from '@/types/domain';

// 로그인 후 응답받는 토큰 데이터 타입
type ResponseToken = {
  accessToken: string;
  refreshToken: string;
};

// 사용자 프로필 요청 타입
type RequestProfile = Omit<Profile, 'userId' | 'nickname' | 'imageName'>;

// 사용자 프로필 반환 타입
type ResponseProfile = {
  userId: number;
  nickname: string;
  imageName: string | null;
};

// 프로필 정보 요청 함수
const getProfile = async (userId: number): Promise<ResponseProfile> => {
  try {
    const {data} = await axiosInstance.get(`/users/${userId}`);
    console.log('Profile data:', data);
    return data;
  } catch (error) {
    console.error('Error fetching profile:', error);
    throw error;  // 에러가 발생하면 다시 던져서 상위에서 처리할 수 있게 함
  }
};

// 프로필 정보 변경 함수
const editProfile = async (userId: number, body: RequestProfile): Promise<ResponseProfile> => {
  const {data} = await axiosInstance.patch(`/users/${userId}`, body);
  return data;
};

// 액세스 토큰 요청 함수
const getAccessToken = async (): Promise<ResponseToken> => {
  const refreshToken = await getEncryptStorage('refreshToken');
  // const {data} = await axiosInstance.get('/auth/refresh', {
  //   headers: {Authorization: `Bearer ${refreshToken}`},
  // });
  return refreshToken;
};

// 로그아웃 요청 함수
const logout = async () => {
  await axiosInstance.post('/users/logout');
};

export {getProfile, editProfile, logout, getAccessToken};
export type {ResponseToken, RequestProfile, ResponseProfile};
