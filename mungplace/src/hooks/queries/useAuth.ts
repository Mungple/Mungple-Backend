import {useEffect} from 'react';
import queryClient from '@/api/queryClient';
import {useMutation, useQuery} from '@tanstack/react-query';
import {numbers, queryKeys, storageKeys} from '@/constants';
import type {UseMutationCustomOptions, UseQueryCustomOptions} from '@/types/common';
import {removeEncryptStorage, removeHeader, setEncryptStorage, setHeader} from '@/utils';
import {ResponseProfile, editProfile, getAccessToken, getProfile, logout, postLogin, postSignup} from '@/api/auth';

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

// 프로필 정보 변경 훅
function useUpdateProfile(mutationOptions?: UseMutationCustomOptions) {
  return useMutation({
    mutationFn: editProfile,
    onSuccess: newProfile => {
      queryClient.setQueryData(
        [queryKeys.AUTH, queryKeys.GET_PROFILE],
        newProfile,
      );
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
  const loginMutation = useLogin();
  const signupMutation = useSignup();
  const logoutMutation = useLogout();
  const profileMutation = useUpdateProfile();
  const refreshTokenQuery = useGetRefreshToken();
  const getProfileQuery = useGetProfile({enabled: refreshTokenQuery.isSuccess});
  const isLogin = getProfileQuery.isSuccess;

  return {signupMutation, loginMutation, getProfileQuery, isLogin, logoutMutation, profileMutation};
}

export default useAuth;
