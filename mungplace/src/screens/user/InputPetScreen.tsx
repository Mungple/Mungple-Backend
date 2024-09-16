import React from 'react';
import styled from 'styled-components/native';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';

import useForm from '@/hooks/useForm';
import {validateInputPet} from '@/utils';
import {authNavigations} from '@/constants';
import CustomButton from '@/components/common/CustomButton';
import CustomInputField from '@/components/common/CustomInputField';
import {AuthStackParamList} from '@/navigations/stack/AuthStackNavigator';

const InputPetScreen: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<AuthStackParamList>>()

  const inputUser = useForm({
    initialValue: {
      petName: '',
      birthday: '',
      gender: '',
      weight: '',
    },
    validate: validateInputPet,
  })

  const handleSubmit = () => {
    console.log('values', inputUser.values);
  };

  return (
    <Container>
      <InputContainer>
        <CustomInputField
          placeholder="반려견 이름"
          error={inputUser.errors.petName}
          touched={inputUser.touched.petName}
          {...inputUser.getTextInputProps('petName')}
        />
        <CustomInputField
          placeholder="생년월일"
          error={inputUser.errors.birthday}
          touched={inputUser.touched.birthday}
          {...inputUser.getTextInputProps('birthday')}
        />
        <CustomInputField
          placeholder="성별"
          error={inputUser.errors.gender}
          touched={inputUser.touched.gender}
          {...inputUser.getTextInputProps('gender')}
        />
        <CustomInputField
          placeholder="몸무게"
          error={inputUser.errors.weight}
          touched={inputUser.touched.weight}
          {...inputUser.getTextInputProps('weight')}
        />
        <CustomButton
          label="등록 완료"
          onPress={() => {
            handleSubmit()
            navigation.navigate(authNavigations.AUTH_HOME)
          }}
        />
      </InputContainer>
    </Container>
  );
};

const Container = styled.SafeAreaView`
  flex: 1;
  justify-content: center;
  padding: 20px;
`;

const InputContainer = styled.View`
  gap: 20px;
`;

export default InputPetScreen;
