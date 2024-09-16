import React from 'react';
import CustomButton from '../common/CustomButton';

function EditProfileHeaderRight(onSubmit: () => void) {
  return <CustomButton label="완료" onPress={onSubmit} />;
}

export default EditProfileHeaderRight;
