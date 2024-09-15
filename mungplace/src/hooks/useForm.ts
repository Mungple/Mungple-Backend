import {useEffect, useState} from 'react';

interface UseFormProps<T> {
  // 폼의 초기값 설정
  initialValue: T;
  // 폼 값에 대한 유효성 검사
  validate: (values: T) => Record<keyof T, string>;
}

const useForm = <T>({initialValue, validate}: UseFormProps<T>) => {
  const [values, setValues] = useState(initialValue);
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  // 입력을 변경할 때 호출 (name에 해당하는 필드 값 업데이트)
  const handleChangeText = (name: keyof T, text: string) => {
    setValues({
      ...values,
      [name]: text,
    });
  };

  // 필드에서 포커스를 벗어났을 때 호출 (해당 필드가 포커스를 잃었음을 기록)
  const handleBlur = (name: keyof T) => {
    setTouched({
      ...touched,
      [name]: true,
    });
  };

  // 입력 필드와 관련된 props 반환 (value, onChangeText, onBlur 포함)
  const getTextInputProps = (name: keyof T) => {
    const value = values[name];
    const onChangeText = (text: string) => handleChangeText(name, text);
    const onBlur = () => handleBlur(name);

    return {value, onChangeText, onBlur};
  };

  // 값이 변경될 때마다 유효성 검사 수행
  useEffect(() => {
    const newErrors = validate(values);
    setErrors(newErrors);
  }, [validate, values]);

  return {values, errors, touched, getTextInputProps};
};

export default useForm;
