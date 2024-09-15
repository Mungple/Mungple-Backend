import React, { useState } from 'react';
import styled from 'styled-components/native';

import {authNavigations} from '@/constants';
import CustomButton from '@/components/common/CustomButton';
import CustomInputField from '@/components/common/CustomInputField';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {AuthStackParamList} from '@/navigations/stack/AuthStackNavigator';

type InputPetScreenProps = NativeStackScreenProps<
  AuthStackParamList,
  typeof authNavigations.INPUT_PET
>;


const InputPetScreen: React.FC<InputPetScreenProps> = ({navigation}) => {
  const [values, setValues] = useState({
    dogName: '',
    birthday: '',
    gender: '',
    weight: '',
  });
  const [touched, setTouched] = useState({
    dogName: false,
    birthday: false,
    gender: false,
    weight: false,
  });
  const handleChangeText = (name: string, text: string) => {
    setValues({
      ...values,
      [name]: text,
    });
  };
  const handleBlur = (name: string) => {
    setTouched({
      ...touched,
      [name]: true,
    });
  }

  return (
    <Container>
      <InputContainer>
        <CustomInputField
          placeholder="반려견 이름"
          error={"이름을 입력하세요"}
          touched={touched.dogName}
          value={values.dogName}
          onChangeText={(text) => handleChangeText('dogName', text)}
          onBlur={() => handleBlur('dogName')}
        />
        <CustomInputField
          placeholder="생년월일"
          error={"생년월일을 입력하세요"}
          touched={touched.birthday}
          value={values.birthday}
          onChangeText={(text) => handleChangeText('birthday', text)}
          onBlur={() => handleBlur('birthday')}
        />
        <CustomInputField
          placeholder="성별"
          error={"성별을 입력하세요"}
          touched={touched.gender}
          value={values.gender}
          onChangeText={(text) => handleChangeText('gender', text)}
          onBlur={() => handleBlur('gender')}
        />
        <CustomInputField
          placeholder="몸무게"
          error={"몸무게를 입력하세요"}
          touched={touched.weight}
          value={values.weight}
          onChangeText={(text) => handleChangeText('weight', text)}
          onBlur={() => handleBlur('weight')}
        />
        <CustomButton
          label="등록 완료"
          onPress={() => navigation.navigate(authNavigations.AUTH_HOME)}
        />
      </InputContainer>
    </Container>
  );
};

const Container = styled.SafeAreaView`
  flex: 1;
  justify-content: center;
  padding: 20px;
`

const InputContainer = styled.View`
  gap: 20;
`

export default InputPetScreen;
