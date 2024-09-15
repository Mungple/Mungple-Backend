import {useMutation} from '@tanstack/react-query';

import {uploadImages} from '@/api';
import {UseMutationCustomOptions} from '@/types';

// 이미지 업로드를 위한 커스텀 훅
function useMutateImages(mutationOptions?: UseMutationCustomOptions) {
  return useMutation({
    mutationFn: uploadImages, // 실제 이미지 업로드를 수행하는 함수 지정
    ...mutationOptions,       // 추가적인 옵션 적용 (옵션이 있을 경우)
  });
}

export default useMutateImages;
