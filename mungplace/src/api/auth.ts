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

// 소셜 로그인 요청 함수
const socialLogin = async (provider: string): Promise<ResponseToken> => {
  const {data} = await axiosInstance.post(`/api/users/login/${provider}`);
  return data;
};

// 프로필 정보 요청 함수
const getProfile = async (userId: number): Promise<ResponseProfile> => {
  const {data} = await axiosInstance.get(`/users/${userId}`);
  return data;
};

// 프로필 정보 변경 함수
const editProfile = async (userId: number, body: RequestProfile): Promise<ResponseProfile> => {
  const {data} = await axiosInstance.patch(`/users/${userId}`, body);
  return data;
};

// 액세스 토큰 요청 함수
const getAccessToken = async (): Promise<ResponseToken> => {
  const refreshToken = await getEncryptStorage('refreshToken');
  const {data} = await axiosInstance.get('/auth/refresh', {
    headers: {Authorization: `Bearer ${refreshToken}`},
  });
  return data;
};

// 로그아웃 요청 함수
const logout = async () => {
  await axiosInstance.post('/users/logout');
};

export {getProfile, editProfile, logout, getAccessToken, socialLogin};
export type {ResponseToken, RequestProfile, ResponseProfile};
