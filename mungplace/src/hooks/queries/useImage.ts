import { useMutation } from '@tanstack/react-query';

import { queryKeys } from '@/constants';
import queryClient from '@/api/queryClient';
import { addImage, addPetImage } from '@/api';
import { UseMutationCustomOptions } from '@/types';

// 이미지 등록를 위한 커스텀 훅
function useMutateImage(mutationOptions?: UseMutationCustomOptions) {
  return useMutation({
    mutationFn: (formData: FormData) => addImage(formData),
    onSuccess: (data) => {
      queryClient.refetchQueries({
        queryKey: [queryKeys.GET_PROFILE],
      });
      return data;
    },
    ...mutationOptions,
  });
}

// 반려견 이미지 등록를 위한 커스텀 훅
function useMutatePetImage(mutationOptions?: UseMutationCustomOptions) {
  return useMutation({
    mutationFn: ([formData, petId]: [FormData, number | undefined]) => addPetImage(formData, petId),
    onSuccess: (data) => {
      queryClient.refetchQueries({
        queryKey: [queryKeys.GET_PETS],
      });
      return data;
    },
    ...mutationOptions,
  });
}

function useImage() {
  const imageMutation = useMutateImage();
  const petImageMutation = useMutatePetImage();

  return {
    imageMutation,
    petImageMutation,
  };
}

export default useImage;
