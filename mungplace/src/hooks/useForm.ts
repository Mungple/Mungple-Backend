import {useEffect, useState} from 'react';

interface UseFormProps<T> {
  initialValue: T;
  validate: (values: T) => Record<keyof T, string>;
}

const useForm = <T>({initialValue, validate}: UseFormProps<T>) => {
  const [values, setValues] = useState(initialValue);
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  // 입력을 변경할 때 호출
  const handleChangeText = (name: keyof T, value: string) => {
    setValues({
      ...values,
      [name]: value,
    });
  };

  // 필드에서 포커스를 벗어났을 때 호출
  const handleBlur = (name: keyof T) => {
    setTouched({
      ...touched,
      [name]: true,
    });
  };

  // 입력 필드와 관련된 props 반환
  const getTextInputProps = (name: keyof T) => {
    const value = values[name];
    const onChangeText = (text: string) => handleChangeText(name, text);
    const onBlur = () => handleBlur(name);
    const isOpen = false

    return {value, onChangeText, onBlur, isOpen};
  };

  // 값이 변경될 때마다 유효성 검사 수행
  useEffect(() => {
    const newErrors = validate(values);
    setErrors(newErrors);
  }, [values]);

  return {values, errors, touched, getTextInputProps, handleChangeText};
};

export default useForm;
