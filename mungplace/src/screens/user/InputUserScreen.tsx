import React from 'react';
import styled from 'styled-components/native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';

import useForm from '@/hooks/useForm';
import {validateInputUser} from '@/utils';
import {authNavigations} from '@/constants';
import CustomButton from '@/components/common/CustomButton';
import CustomInputField from '@/components/common/CustomInputField';
import {AuthStackParamList} from '@/navigations/stack/AuthStackNavigator';

type InputUserScreenProps = NativeStackScreenProps<
  AuthStackParamList,
  typeof authNavigations.INPUT_USER
>;

const InputUserScreen: React.FC<InputUserScreenProps> = ({navigation}) => {
  const inputUser = useForm({
    initialValue: {nickname: ''},
    validate: validateInputUser,
  })

  const handleSubmit = () => {
    navigation.navigate(authNavigations.INPUT_PET)
  };

  return (
    <Container>
      <InputContainer>
        <CustomInputField
          placeholder="닉네임"
          blurOnSubmit={false}
          error={inputUser.errors.nickname}
          touched={inputUser.touched.nickname}
          {...inputUser.getTextInputProps('nickname')}
        />
        <CustomButton
          label="등록하기"
          onPress={handleSubmit}
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
  gap: 20;
`;

export default InputUserScreen;
