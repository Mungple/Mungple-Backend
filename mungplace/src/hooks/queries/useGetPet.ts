import {useQuery} from '@tanstack/react-query'

import {getPetProfiles} from '@/api'
import {queryKeys} from '@/constants'
import {ResponsePetProfile, UseQueryCustomOptions} from '@/types'

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
  })
}

export default useGetPet
