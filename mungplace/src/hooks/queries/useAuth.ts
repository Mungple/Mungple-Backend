import {useEffect} from 'react';
import {useMutation, useQuery} from '@tanstack/react-query';
// API 관련 함수들
import {
  ResponseProfile,
  getAccessToken,
  getProfile,
  logout,
  postLogin,
  postSignup,
} from '@/api/auth';
// JWT 저장 및 삭제 관련 유틸리티 함수들
import {
  removeEncryptStorage,
  removeHeader,
  setEncryptStorage,
  setHeader,
} from '@/utils';
import queryClient from '@/api/queryClient';
// React Query의 QueryClient 인스턴스
import {numbers, queryKeys, storageKeys} from '@/constants';
import type {UseMutationCustomOptions, UseQueryCustomOptions} from '@/types/common';

// 회원가입 커스텀 훅
function useSignup(mutationOptions?: UseMutationCustomOptions) {
  return useMutation({
    mutationFn: postSignup, // postSignup 함수로 회원가입 API 요청을 보냄
    ...mutationOptions,     // 추가적인 옵션을 받아서 커스터마이징 가능
  });
}

// 로그인 커스텀 훅
function useLogin(mutationOptions?: UseMutationCustomOptions) {
  return useMutation({
    // postLogin 함수로 로그인 API 요청을 보냄
    mutationFn: postLogin,
    // 로그인 성공 시 액세스 토큰을 Authorization 헤더에 설정, 리프레시 토큰을 안전하게 저장
    onSuccess: ({accessToken, refreshToken}) => {
      setHeader('Authorization', `Bearer ${accessToken}`);
      setEncryptStorage(storageKeys.REFRESH_TOKEN, refreshToken);
    },
    // 로그인 후 액세스 토큰과 프로필 정보를 다시 가져옴
    onSettled: () => {
      queryClient.refetchQueries({
        queryKey: [queryKeys.AUTH, queryKeys.GET_ACCESS_TOKEN],
      });
      queryClient.invalidateQueries({
        queryKey: [queryKeys.AUTH, queryKeys.GET_PROFILE],
      });
    },
    ...mutationOptions,
  });
}

// 리프레시 토큰 가져오기 훅
function useGetRefreshToken() {
  const {data, error, isSuccess, isError} = useQuery({
    queryKey: [queryKeys.AUTH, queryKeys.GET_ACCESS_TOKEN],
    queryFn: getAccessToken,
    staleTime: numbers.ACCESS_TOKEN_REFRESH_TIME,
    refetchInterval: numbers.ACCESS_TOKEN_REFRESH_TIME,
    refetchOnReconnect: true,
    refetchIntervalInBackground: true,
  });

  // 성공적으로 액세스 토큰을 가져왔을 때 헤더와 저장소에 저장
  useEffect(() => {
    if (isSuccess) {
      setHeader('Authorization', `Bearer ${data.accessToken}`);
      setEncryptStorage(storageKeys.REFRESH_TOKEN, data.refreshToken);
    }
  }, [isSuccess]);

  // 오류 발생 시 헤더와 저장소에서 토큰 삭제
  useEffect(() => {
    if (isError) {
      removeHeader('Authorization');
      removeEncryptStorage(storageKeys.REFRESH_TOKEN);
    }
  }, [isError]);

  return {isSuccess, isError}; // 성공 및 오류 여부 반환
}

// 프로필 정보 가져오기 훅
function useGetProfile(queryOptions?: UseQueryCustomOptions<ResponseProfile>) {
  return useQuery({
    queryFn: getProfile,
    queryKey: [queryKeys.AUTH, queryKeys.GET_PROFILE],
    ...queryOptions,
  });
}

// 로그아웃 커스텀 훅
function useLogout(mutationOptions?: UseMutationCustomOptions) {
  return useMutation({
    mutationFn: logout,
    onSuccess: () => {
      removeHeader('Authorization');
      removeEncryptStorage(storageKeys.REFRESH_TOKEN);
    },
    onSettled: () => {
      queryClient.invalidateQueries({queryKey: [queryKeys.AUTH]});
    },
    ...mutationOptions,
  });
}

function useAuth() {
  const signupMutation = useSignup();
  const refreshTokenQuery = useGetRefreshToken();
  const getProfileQuery = useGetProfile({
    enabled: refreshTokenQuery.isSuccess,
  });
  const isLogin = getProfileQuery.isSuccess;
  const loginMutation = useLogin();
  const logoutMutation = useLogout();

  return {
    signupMutation,
    loginMutation,
    getProfileQuery,
    isLogin,
    logoutMutation,
  };
}

export default useAuth;
