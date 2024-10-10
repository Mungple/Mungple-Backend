import { useQuery } from '@tanstack/react-query';

import { getPetFacility } from '@/api';
import { queryKeys } from '@/constants';
import { FacilityPoints, UseQueryCustomOptions } from '@/types';

function useGetPetFacility(
  lat: number | null,
  lon: number | null,
  queryOptions?: UseQueryCustomOptions<FacilityPoints>,
) {
  return useQuery({
    queryFn: () => getPetFacility(Number(lat), Number(lon)),
    queryKey: [queryKeys.GET_PET_FACILITIY, lat, lon],
    enabled: Boolean(lat) && Boolean(lon),
    throwOnError: true,
    ...queryOptions,
  });
}

export default useGetPetFacility;
