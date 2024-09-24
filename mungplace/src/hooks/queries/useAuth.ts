import {useEffect} from 'react';
import queryClient from '@/api/queryClient';
import {MutationFunction, UseQueryOptions, useMutation, useQuery} from '@tanstack/react-query';
import {numbers, queryKeys, storageKeys} from '@/constants';
import type {
  ResponseError,
  UseMutationCustomOptions,
  UseQueryCustomOptions,
} from '@/types/common';
import {
  removeEncryptStorage,
  removeHeader,
  setEncryptStorage,
  setHeader,
} from '@/utils';
import {
  getProfile,
  editProfile,
  logout,
  getAccessToken,
  socialLogin,
  ResponseToken,
  ResponseProfile,
  RequestProfile,
} from '@/api/auth';

// 로그인 커스텀 훅
function useLogin<T>(
  loginAPI: MutationFunction<ResponseToken, T>,
  mutationOptions?: UseMutationCustomOptions,
) {
  return useMutation({
    mutationFn: loginAPI,
    onSuccess: ({accessToken, refreshToken}) => {
      setHeader('Authorization', `Bearer ${accessToken}`);
      setEncryptStorage(storageKeys.REFRESH_TOKEN, refreshToken);
    },
    onSettled: () => {
      queryClient.refetchQueries({
        queryKey: [queryKeys.AUTH, queryKeys.GET_ACCESS_TOKEN],
      });
      queryClient.invalidateQueries({
        queryKey: [queryKeys.AUTH, queryKeys.GET_PROFILE],
      });
    },
    throwOnError: error => Number(error.response?.status) >= 500,
    ...mutationOptions,
  });
}

function useSocialLogin(mutationOptions?: UseMutationCustomOptions) {
  return useLogin(socialLogin, mutationOptions);
}

// 리프레시 토큰 가져오기 훅
function useGetRefreshToken() {
  const {data, isSuccess, isError} = useQuery({
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
function useGetProfile(
  userId: number, 
  queryOptions?: UseQueryOptions<ResponseProfile, Error>
) {
  return useQuery<ResponseProfile, Error>({
    queryFn: () => getProfile(userId),
    queryKey: [queryKeys.AUTH, queryKeys.GET_PROFILE, userId],
    ...queryOptions,
  });
}

// 프로필 정보 변경 훅
function useUpdateProfile(mutationOptions?: UseMutationCustomOptions) {
  return useMutation<ResponseProfile, ResponseError, { userId: number; body: RequestProfile }>({
    mutationFn: ({userId, body}) => editProfile(userId, body),
    onSuccess: newProfile => {
      queryClient.setQueryData([queryKeys.AUTH, queryKeys.GET_PROFILE], newProfile);
    },
    ...mutationOptions,
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
  const logoutMutation = useLogout();
  const profileMutation = useUpdateProfile();
  const socialLoginMutation = useSocialLogin();
  const refreshTokenQuery = useGetRefreshToken();
  const getProfileQuery = useGetProfile({enabled: refreshTokenQuery.isSuccess});
  const isLogin = getProfileQuery.isSuccess;

  return {
    isLogin,
    logoutMutation,
    profileMutation,
    getProfileQuery,
    socialLoginMutation,
  };
}

export default useAuth;
