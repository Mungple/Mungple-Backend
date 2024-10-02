import { useMutation, useQuery } from '@tanstack/react-query';

import {
  RequestProfile,
  ResponseProfile,
  editProfile,
  getProfile,
  getUserId,
  logout,
  socialLogin,
} from '@/api/auth';
import queryClient from '@/api/queryClient';
import { queryKeys, storageKeys } from '@/constants';
import type {
  ResponseError,
  UseMutationCustomOptions,
  UseQueryCustomOptions,
} from '@/types/common';
import { removeHeader, setEncryptStorage, setHeader } from '@/utils';
import { useUserStore } from '@/state/useUserStore';
import { useAppStore } from '@/state/useAppStore';

// 로그인 커스텀 훅
function useLogin(mutationOptions?: UseMutationCustomOptions) {
  return useMutation({
    mutationFn: (loginUrl: string) => socialLogin(loginUrl),
    onSuccess: async (accessToken) => {
      const { setUserId } = useUserStore.getState();
      const { setToken } = useAppStore.getState();

      setHeader('Authorization', `Bearer ${accessToken}`);
      setEncryptStorage(storageKeys.ACCESS_TOKEN, accessToken);
      setToken(accessToken);

      const userId = await getUserId(accessToken);
      setUserId(Number(userId));
    },
    onSettled: () => {
      queryClient.refetchQueries({
        queryKey: [queryKeys.AUTH, queryKeys.GET_ACCESS_TOKEN],
      });
      queryClient.invalidateQueries({
        queryKey: [queryKeys.AUTH, queryKeys.GET_PROFILE],
      });
    },
    throwOnError: (error) => Number(error.response?.status) >= 500,
    ...mutationOptions,
  });
}

// 유저 아이디 가져오기
function useGetUserId(token: string | null, queryOptions?: UseQueryCustomOptions<number>) {
  return useQuery({
    queryFn: () => getUserId(String(token)),
    queryKey: [queryKeys.GET_USER_ID, token],
    enabled: Boolean(token),
    throwOnError: true,
    ...queryOptions,
  });
}

// 프로필 정보 가져오기 훅
function useGetProfile(userId: number, queryOptions?: UseQueryCustomOptions<ResponseProfile>) {
  return useQuery({
    queryFn: () => getProfile(userId),
    queryKey: [queryKeys.AUTH, queryKeys.GET_PROFILE],
    enabled: Boolean(userId),
    ...queryOptions,
  });
}

// 프로필 정보 변경 훅
function useUpdateProfile(mutationOptions?: UseMutationCustomOptions) {
  return useMutation<ResponseProfile, ResponseError, { userId: number; body: RequestProfile }>({
    mutationFn: ({ userId, body }) => editProfile(userId, body),
    onSuccess: (newProfile) => {
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
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: [queryKeys.AUTH] });
    },
    ...mutationOptions,
  });
}

function useAuth() {
  const loginMutation = useLogin();
  const logoutMutation = useLogout();
  const profileMutation = useUpdateProfile();

  return {
    loginMutation,
    logoutMutation,
    profileMutation,
    useGetProfile,
    useGetUserId,
  };
}

export default useAuth;
