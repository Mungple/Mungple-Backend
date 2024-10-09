import axiosInstance from './axios';
import { jwtDecode } from 'jwt-decode';

import { getEncryptStorage } from '@/utils';
import { storageKeys } from '@/constants';
import { CustomJwtPayload, ResponseUserProfile } from '@/types';

// 소셜 로그인 함수
const socialLogin = async (url: string): Promise<string> => {
  const pathSegments = url.split('/');
  const accessToken = pathSegments[pathSegments.length - 1];
  return accessToken;
};

// 유저 아이디 해석 함수
const getUserId = async (token: string): Promise<number> => {
  const decodedCode = jwtDecode<CustomJwtPayload>(token);
  const userId = decodedCode.userId;
  return userId;
};

// 프로필 정보 요청 함수
const getProfile = async (userId: number): Promise<ResponseUserProfile> => {
  try {
    const { data } = await axiosInstance.get(`/users/${userId}`, {
      headers: {
        'Content-Type': `application/json; charset=utf8`,
      },
    });
    return data;
  } catch (error) {
    console.error('[FAIL] getProfile :', error);
    throw error;
  }
};

// 액세스 토큰 요청 함수
const getAccessToken = async (): Promise<string> => {
  const accessToken = await getEncryptStorage(storageKeys.ACCESS_TOKEN);
  return accessToken;
};

export { getAccessToken, getProfile, socialLogin, getUserId };
