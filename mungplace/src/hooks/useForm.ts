import { useEffect, useState } from 'react';

interface UseFormProps<T> {
  initialValue: T;
  validate: (values: T) => Record<keyof T, string>;
}

const formatBirthDate = (value: string) => {
  // 숫자만 남기기
  const cleanedValue = value.replace(/[^0-9]/g, '');

  // 길이에 따라 하이픈을 삽입
  if (cleanedValue.length <= 3) {
    return cleanedValue;
  } else if (cleanedValue.length <= 5) {
    return `${cleanedValue.slice(0, 4)}-${cleanedValue.slice(4)}`;
  } else {
    return `${cleanedValue.slice(0, 4)}-${cleanedValue.slice(4, 6)}-${cleanedValue.slice(6)}`;
  }
};

const useForm = <T>({ initialValue, validate }: UseFormProps<T>) => {
  const [values, setValues] = useState(initialValue);
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isValid, setIsValid] = useState<boolean>(false);

  // 입력을 변경할 때 호출
  const handleChangeText = (name: keyof T, value: string | number) => {
    // 생년월일 필드에 대해 자동 하이픈 삽입 로직 적용
    if (name === 'petBirth') {
      const formattedValue = formatBirthDate(String(value));
      setValues({ ...values, [name]: formattedValue });
    } else {
      setValues({ ...values, [name]: value });
    }
  };

  // 필드에서 포커스를 벗어났을 때 호출
  const handleBlur = (name: keyof T) => {
    setTouched({ ...touched, [name]: true });
  };

  // 입력 필드와 관련된 props 반환
  const getTextInputProps = (name: keyof T) => {
    const value = values[name];
    const onChangeText = (text: string) => handleChangeText(name, text);
    const onBlur = () => handleBlur(name);

    return { value, onChangeText, onBlur };
  };

  // 값이 변경될 때마다 유효성 검사 수행
  useEffect(() => {
    const newErrors = validate(values);
    setErrors(newErrors);

    const hasNoErrors = Object.values(newErrors).every((error) => error === '');
    setIsValid(hasNoErrors);
  }, [values]);

  return { values, errors, touched, isValid, getTextInputProps, handleChangeText };
};

export default useForm;
