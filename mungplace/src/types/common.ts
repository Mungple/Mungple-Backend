// React Query와 Axios를 함께 사용할 때 타입스크립트의 장점을 최대한 활용하여,
// 에러 처리와 옵션 타입을 커스텀하고 일관성 있게 관리하기 위한 것
// 이를 통해 코드의 가독성, 재사용성, 유지보수성을 모두 향상
import {AxiosError} from 'axios';
import {QueryKey, UseMutationOptions, UseQueryOptions} from '@tanstack/react-query';

// Axios에서 발생하는 에러 타입 정의
type ResponseError = AxiosError<{
  statusCode: number;  // 에러 상태 코드
  message: string;     // 에러 메시지
  error: string;       // 에러 타입 또는 세부사항
}>;

// 커스텀 Mutation 옵션 타입 정의
// TData: 성공 시 반환되는 데이터 타입
// TVariables: 뮤테이션에 전달되는 변수 타입
type UseMutationCustomOptions<TData = unknown, TVariables = unknown> = Omit<
  UseMutationOptions<TData, ResponseError, TVariables, unknown>,
  'mutationFn'
>;

// 커스텀 Query 옵션 타입 정의
// TQueryFnData: 서버에서 반환되는 원본 데이터 타입
// TData: 변환된 데이터 타입
type UseQueryCustomOptions<TQueryFnData = unknown, TData = TQueryFnData> = Omit<
  UseQueryOptions<TQueryFnData, ResponseError, TData, QueryKey>,
  'queryKey'
>;

export type {ResponseError, UseMutationCustomOptions, UseQueryCustomOptions};
