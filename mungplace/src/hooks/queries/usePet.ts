import { useMutation, useQuery } from '@tanstack/react-query';

import { queryKeys } from '@/constants';
import queryClient from '@/api/queryClient';
import { createPetProfile, deletePetProfile, editPetProfile, getPetProfiles } from '@/api';
import { ResponsePetProfile, UseMutationCustomOptions, UseQueryCustomOptions } from '@/types';

function useGetPet(
  userId: number | null,
  queryOptions?: UseQueryCustomOptions<ResponsePetProfile[]>,
) {
  return useQuery({
    queryFn: () => getPetProfiles(Number(userId)),
    queryKey: [queryKeys.GET_PETS, userId],
    enabled: Boolean(userId),
    throwOnError: true,
    ...queryOptions,
  });
}

function usePostPet(queryOptions?: UseMutationCustomOptions) {
  return useMutation({
    mutationFn: (JSON: string) => createPetProfile(JSON),
    onSuccess: () => {
      queryClient.refetchQueries({
        queryKey: [queryKeys.GET_PETS],
      });
    },
    throwOnError: true,
    ...queryOptions,
  });
}

function usePutPet(queryOptions?: UseMutationCustomOptions) {
  return useMutation({
    mutationFn: ([petId, JSON]: [number, string]) => editPetProfile(petId, JSON),
    onSuccess: () => {
      queryClient.refetchQueries({
        queryKey: [queryKeys.GET_PETS],
      });
    },
    throwOnError: true,
    ...queryOptions,
  });
}

function useDeletePet(queryOptions?: UseMutationCustomOptions) {
  return useMutation({
    mutationFn: (petId: number) => deletePetProfile(petId),
    onSuccess: () => {
      queryClient.refetchQueries({
        queryKey: [queryKeys.GET_PETS],
      });
    },
    throwOnError: true,
    ...queryOptions,
  });
}

function usePet() {
  const postPetMutation = usePostPet();
  const putPetMutation = usePutPet();
  const deletePetMutation = useDeletePet();

  return {
    useGetPet,
    postPetMutation,
    putPetMutation,
    deletePetMutation,
  };
}

export default usePet;
