import {useQuery} from '@tanstack/react-query'
import {queryKeys} from '@/constants'
import {UseQueryCustomOptions} from '@/types'

function useGetUserId(queryOptions?: UseQueryCustomOptions<number>) {
  return useQuery({
    queryFn: () => getUserId()
    queryKey: [queryKeys.AUTH, queryKeys.GET_USER_ID],
    throwOnError: true,
    ...queryOptions,
  })
}

export default useGetUserId
