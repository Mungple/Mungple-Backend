import { useMutation, useQuery } from '@tanstack/react-query';

import { getPetProfiles } from '@/api';
import {
  RequestProfile,
  ResponseProfile,
  editProfile,
  getProfile,
  logout,
  socialLogin,
} from '@/api/auth';
import queryClient from '@/api/queryClient';
import { queryKeys } from '@/constants';
import { useUserStore } from '@/state/useUserStore';
import type { ResponseError, UseMutationCustomOptions, UseQueryCustomOptions } from '@/types/common';
import { removeHeader, setHeader } from '@/utils';
import { JwtPayload, jwtDecode } from 'jwt-decode';

interface CustomJwtPayload extends JwtPayload {
  userId: number;
}

// 로그인 커스텀 훅
function useLogin(mutationOptions?: UseMutationCustomOptions) {
  return useMutation({
    mutationFn: (loginUrl: string) => socialLogin(loginUrl),
    onSuccess: ({accessToken}) => {
      const {setUserId, setPetData} = useUserStore.getState();
      setHeader('Authorization', `Bearer ${accessToken}`);
      // setEncryptStorage(storageKeys.REFRESH_TOKEN, accessToken);
      
      const decoded = jwtDecode<CustomJwtPayload>(`${accessToken}`)
      setUserId(decoded.userId)
      
      const getPetProfile = async () => {
        const data = await getPetProfiles(decoded.userId);
        setPetData(data)
      }
      getPetProfile()
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

// 프로필 정보 가져오기 훅
function useGetProfile(
  userId: number,
  queryOptions?: UseQueryCustomOptions<ResponseProfile>
) {
  return useQuery({
    queryFn: () => getProfile(userId),
    queryKey: [queryKeys.AUTH, queryKeys.GET_PROFILE],
    enabled: !!userId,
    ...queryOptions,
  });
}

// 프로필 정보 변경 훅
function useUpdateProfile(mutationOptions?: UseMutationCustomOptions) {
  return useMutation<
    ResponseProfile,
    ResponseError,
    {userId: number; body: RequestProfile}
  >({
    mutationFn: ({userId, body}) => editProfile(userId, body),
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
    },
    onSettled: () => {
      queryClient.invalidateQueries({queryKey: [queryKeys.AUTH]});
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
  };
}

export default useAuth;
