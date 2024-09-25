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
  petBirth: string,
  petGender: string,
  petWeight: string,
}) {
  const errors = {
    petName: '',
    petBirth: '',
    petGender: '',
    petWeight: '',
  };

  if (isBlank(values.petName)) {
    errors.petName = '반려견 이름을 입력해주세요.';
  }
  if (isBlank(values.petBirth)) {
    errors.petBirth = '생년월일을 입력해주세요.';
  }
  if (isBlank(values.petGender)) {
    errors.petGender = '성별을 입력해주세요.';
  }
  if (isBlank(values.petWeight)) {
    errors.petWeight = '몸무게를 입력해주세요.';
  }

  return errors;
}

export {validateInputUser, validateInputPet};
