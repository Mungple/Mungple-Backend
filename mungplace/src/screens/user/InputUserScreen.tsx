import React from 'react';
import styled from 'styled-components/native';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';

import useForm from '@/hooks/useForm';
import {validateInputUser} from '@/utils';
import {authNavigations} from '@/constants';
import CustomButton from '@/components/common/CustomButton';
import CustomInputField from '@/components/common/CustomInputField';
import CustomImageInput from '@/components/common/CustomImageInput';
import {AuthStackParamList} from '@/navigations/stack/AuthStackNavigator';

const InputUserScreen: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<AuthStackParamList>>()
  
  const inputUser = useForm({
    initialValue: {nickname: ''},
    validate: validateInputUser,
  })

  const handleSubmit = () => {


    navigation.navigate(authNavigations.INPUT_PET)
  };

  // const imagePicker = useImagePicker({
  //   initialImages: [],
  // });

  return (
    <Container>
      <InputContainer>
        <ImageInput onChange={() => {}} />
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
  align-items: center;
  justify-content: center;
  padding: 20px;
`;

const InputContainer = styled.View`
  gap: 20;
`;

const ImageInput = styled(CustomImageInput)``

export default InputUserScreen;
