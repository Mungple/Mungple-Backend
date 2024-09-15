import ImagePicker from 'react-native-image-crop-picker';

import {getFormDataImages} from '@/utils';

const useImagePicker = () => {
  const handleChange = () => {
    ImagePicker.openPicker({
      mediaType: 'photo',
      multiple: true,
      includeBase64: true,
      maxFiles: 5,
      cropperChooseText: '완료',
      cropperCancelText: '취소',
    })
      .then(images => {
        const formData = getFormDataImages('images', images)
      })
      .catch(error => {
        if (error.code !== 'E_PICKER_CANCELLED') {}
      });
  };
}

export default useImagePicker;
