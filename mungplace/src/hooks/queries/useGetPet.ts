import {useQuery} from '@tanstack/react-query';

import {getPetProfiles} from '@/api';
import {queryKeys} from '@/constants';
import {ResponsePetProfile, UseQueryCustomOptions} from '@/types';

function useGetPet(
  userId: number,
  queryOptions?: UseQueryCustomOptions<ResponsePetProfile[]>,
) {
  return useQuery({
    queryFn: () => getPetProfiles(userId),
    queryKey: [queryKeys.GET_PETS],
    throwOnError: true,
    ...queryOptions,
  });
}

export default useGetPet;
