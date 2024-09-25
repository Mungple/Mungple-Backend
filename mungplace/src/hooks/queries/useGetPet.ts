import {useQuery} from '@tanstack/react-query';

import {getPetProfiles} from '@/api';
import {queryKeys} from '@/constants';
import {UseQueryCustomOptions} from '@/types';

type PetProfile = {
  id: number;
  default: boolean;
  name: string;
  gender: 'Male' | 'Female';
  weight: number;
  birth: string;
  photoId: string | null;
};

type ResponsePetProfile = {
  pets: PetProfile[];
};

// 반려견 프로필 정보 가져오기 훅
function useGetPet(queryOptions?: UseQueryCustomOptions<ResponsePetProfile>) {
  return useQuery({
    queryFn: getPetProfiles,
    queryKey: [queryKeys.GET_PETS],
    ...queryOptions,
  });
}

export default useGetPet;
