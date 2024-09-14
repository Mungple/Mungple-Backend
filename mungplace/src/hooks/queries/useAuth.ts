import {MutationFunction, useMutation, useQuery} from '@tanstack/react-query';

import {
  ResponseProfile,
  ResponseToken,
  getProfile,
  kakaoLogin,
  logout,
  postLogin,
  postSignup,
} from '@/api/auth';
import {removeHeader, setHeader} from '@/utils';
import queryClient from '@/api/queryClient';
import {queryKeys} from '@/constants';
import type {
  UseMutationCustomOptions,
  UseQueryCustomOptions,
} from '@/types/common';

function useSignup(mutationOptions?: UseMutationCustomOptions) {
  return useMutation({
    mutationFn: postSignup,
    ...mutationOptions,
  });
}

function useLogin<T>(
  loginAPI: MutationFunction<ResponseToken, T>,
  mutationOptions?: UseMutationCustomOptions,
) {
  return useMutation({
    mutationFn: postLogin,
    onSuccess: ({accessToken, refreshToken}) => {
      setHeader('Authorization', `Bearer ${accessToken}`);
    },
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

function useEmailLogin(mutationOptions?: UseMutationCustomOptions) {
  return useLogin(postLogin, mutationOptions);
}

function useKakaoLogin(mutationOptions?: UseMutationCustomOptions) {
  return useLogin(kakaoLogin, mutationOptions);
}

function useGetProfile(queryOptions?: UseQueryCustomOptions<ResponseProfile>) {
  return useQuery({
    queryFn: getProfile,
    queryKey: [queryKeys.AUTH, queryKeys.GET_PROFILE],
    ...queryOptions,
  });
}

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
  const signupMutation = useSignup();
  const logoutMutation = useLogout();
  const loginMutation = useEmailLogin();
  const getProfileQuery = useGetProfile();
  const kakaoLoginMutation = useKakaoLogin();
  const isLogin = getProfileQuery.isSuccess;

  return {
    isLogin,
    loginMutation,
    logoutMutation,
    signupMutation,
    getProfileQuery,
    kakaoLoginMutation,
  };
}

export default useAuth;
