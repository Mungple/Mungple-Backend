function isBlank(value: string) {
  return value.trim() === '';
}

function validateInputUser(values: {nickname: string}) {
  const errors = {
    nickname: '',
  };

  if (isBlank(values.nickname)) {
    errors.nickname = '닉네임을 입력해주세요.';
  }

  return errors;
}

function validateInputPet(values: {
  petName: string,
  birthday: string,
  gender: string,
  weight: string,
}) {
  const errors = {
    petName: '',
    birthday: '',
    gender: '',
    weight: '',
  };

  if (isBlank(values.petName)) {
    errors.petName = '반려견 이름을 입력해주세요.';
  }
  if (isBlank(values.birthday)) {
    errors.birthday = '생년월일을 입력해주세요.';
  }
  if (isBlank(values.gender)) {
    errors.gender = '성별을 입력해주세요.';
  }
  if (isBlank(values.weight)) {
    errors.weight = '몸무게를 입력해주세요.';
  }

  return errors;
}

export {validateInputUser, validateInputPet};
