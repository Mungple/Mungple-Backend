import { RequestPetProfile } from '@/types';

function isBlank(value: string) {
  return value.trim() === '';
}

function isZero(value: number) {
  return value === 0;
}

function validateInputUser(values: { nickname: string }) {
  const errors = {
    nickname: '',
  };

  if (isBlank(values.nickname)) {
    errors.nickname = '닉네임을 입력해주세요.';
  }

  return errors;
}

function validateInputPet(values: RequestPetProfile) {
  const errors = {
    petName: '',
    petBirth: '',
    petGender: '',
    petWeight: '',
  };

  if (isBlank(values.petName)) {
    errors.petName = '반려견 이름을 입력해주세요.';
  } else if (values.petName.length > 20) {
    errors.petName = '반려견 이름은 20자 이하로 입력해주세요.';
  }
  if (isBlank(values.petBirth)) {
    errors.petBirth = '생년월일을 입력해주세요.';
  } else if (!/^\d{4}-\d{2}-\d{2}$/.test(values.petBirth)) {
    errors.petBirth = '생년월일은 YYYY-MM-DD 형식으로 입력해주세요.';
  }
  if (isBlank(values.petGender)) {
    errors.petGender = '성별을 입력해주세요.';
  }
  if (isZero(Number(values.petWeight))) {
    errors.petWeight = '몸무게를 정확히 입력해주세요.';
  } else if (isNaN(values.petWeight)) {
    errors.petWeight = '몸무게는 숫자로 입력해주세요.';
  } else if (Number(values.petWeight) < 0 || Number(values.petWeight) > 1000000) {
    errors.petWeight = '몸무게는 0kg 이상 1000kg 이하로 입력해주세요.';
  }

  return errors;
}

export { validateInputUser, validateInputPet };
