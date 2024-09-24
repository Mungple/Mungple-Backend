import queryClient from '@/api/queryClient';
import {useMutation, useQuery} from '@tanstack/react-query';
import {queryKeys} from '@/constants';
import type {
  ResponseError,
  UseMutationCustomOptions,
  UseQueryCustomOptions,
} from '@/types/common';
import {
  removeHeader,
  setHeader,
} from '@/utils';
import {
  getProfile,
  editProfile,
  logout,
  ResponseProfile,
  RequestProfile,
} from '@/api/auth';

// 로그인 커스텀 훅
function useLogin(mutationOptions?: UseMutationCustomOptions) {
  return useMutation({
    // 비동기 작업을 수행하는 함수
    mutationFn: async (accessToken: string) => {
      return accessToken;
    },
    onSuccess: (accessToken: string) => {
      console.log('onSuccess')
      setHeader('Authorization', `Bearer ${accessToken}`);
      setHeader('Content-Type', `application/json; charset=utf8`);
    },
    onSettled: () => {
      queryClient.refetchQueries({
        queryKey: [queryKeys.AUTH, queryKeys.GET_PROFILE],
      });
    },
    throwOnError: error => Number(error.response?.status) >= 500,
    ...mutationOptions,
  });
}

function useSocialLogin(mutationOptions?: UseMutationCustomOptions) {
  return useLogin(mutationOptions);
}

// 프로필 정보 가져오기 훅
function useGetProfile(userId: number, queryOptions?: UseQueryCustomOptions<ResponseProfile>) {
  return useQuery({
    queryFn: () => getProfile(userId),
    queryKey: [queryKeys.AUTH, queryKeys.GET_PROFILE, userId],
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
  const logoutMutation = useLogout();
  const profileMutation = useUpdateProfile();
  const socialLoginMutation = useSocialLogin();
  const getProfileQuery = useGetProfile(1);
  const isLogin = getProfileQuery.isSuccess;

  return {
    isLogin,
    logoutMutation,
    profileMutation,
    socialLoginMutation,
    getProfileQuery,
    useSocialLogin,
  };
}

export default useAuth;
