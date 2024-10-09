import { useMutation, useQuery } from '@tanstack/react-query';

import queryClient from '@/api/queryClient';
import { ResponseUserProfile } from '@/types';
import { useAppStore } from '@/state/useAppStore';
import { useUserStore } from '@/state/useUserStore';
import { queryKeys, storageKeys } from '@/constants';
import { setEncryptStorage, setHeader } from '@/utils';
import { getProfile, getUserId, socialLogin } from '@/api';
import type { UseMutationCustomOptions, UseQueryCustomOptions } from '@/types/common';

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
function useGetProfile(userId: number, queryOptions?: UseQueryCustomOptions<ResponseUserProfile>) {
  return useQuery({
    queryFn: () => getProfile(userId),
    queryKey: [queryKeys.AUTH, queryKeys.GET_PROFILE, userId],
    enabled: Boolean(userId),
    ...queryOptions,
  });
}

function useAuth() {
  const loginMutation = useLogin();

  return {
    loginMutation,
    useGetProfile,
    useGetUserId,
  };
}

export default useAuth;
