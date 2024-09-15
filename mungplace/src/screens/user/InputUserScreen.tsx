import React, {useState} from 'react';
import styled from 'styled-components/native';

import {authNavigations} from '@/constants';
import CustomButton from '@/components/common/CustomButton';
import CustomInputField from '@/components/common/CustomInputField';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {AuthStackParamList} from '@/navigations/stack/AuthStackNavigator';

type InputUserScreenProps = NativeStackScreenProps<
  AuthStackParamList,
  typeof authNavigations.INPUT_USER
>;

const InputUserScreen: React.FC<InputUserScreenProps> = ({navigation}) => {
  const [values, setValues] = useState({
    photo: '',
    nickname: '',
  });
  const [touched, setTouched] = useState({
    photo: false,
    nickname: false,
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
          placeholder="사진"
          error={"닉네임을 입력하세요"}
          touched={touched.photo}
          value={values.photo}
          onChangeText={(text) => handleChangeText('photo', text)}
          onBlur={() => handleBlur('photo')}
        />
        <CustomInputField
          placeholder="닉네임"
          error={"닉네임을 입력하세요"}
          touched={touched.nickname}
          value={values.nickname}
          onChangeText={(text) => handleChangeText('nickname', text)}
          onBlur={() => handleBlur('nickname')}
        />
        <CustomButton
          label="등록하기"
          onPress={() => navigation.navigate(authNavigations.INPUT_PET)}
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
