import React from 'react';
import styled from 'styled-components/native';
import { Alert, Keyboard, Text } from 'react-native';

import useForm from '@/hooks/useForm';
import { validateInputPet } from '@/utils';
import usePet from '@/hooks/queries/usePet';
import { ResponsePetProfile } from '@/types';
import ImagePicker from '../common/ImagePicker';
import { useUserStore } from '@/state/useUserStore';
import { useNavigation } from '@react-navigation/native';
import RadioButtonGroup from '../common/RadioButtonGroup';
import CustomButton from '@/components/common/CustomButton';
import CustomInputField from '@/components/common/CustomInputField';

type PetFormProps = {
  petData?: ResponsePetProfile;
  setModalVisible: (visible: boolean) => void;
};

const PetForm = ({ setModalVisible, petData }: PetFormProps) => {
  const { userId } = useUserStore.getState();
  const { postPetMutation, putPetMutation } = usePet();
  const navigation = useNavigation();

  const inputUser = useForm({
    initialValue: {
      petName: petData ? petData.name : '',
      petGender: petData ? petData.gender : 'MALE',
      petWeight: petData ? petData.weight : 0,
      petBirth: petData ? petData.birth.slice(0, 10) : '',
    },
    validate: validateInputPet,
  });

  // 프로필 이미지 클릭 시 모달을 열고 키보드를 숨김
  const handlePressImage = () => {
    Keyboard.dismiss();
  };

  const handleRadioChange = (value: string) => {
    inputUser.handleChangeText('petGender', value);
  };

  const handleSubmit = () => {
    if (userId) {
      const submitData = JSON.stringify({
        ...inputUser.values,
        petWeight: Number(inputUser.values.petWeight),
      });

      if (petData) {
        putPetMutation.mutate([petData.id, submitData]);
        setModalVisible(false);
        navigation.goBack();
        Alert.alert('Complete', `반려견 변경이 완료되었습니다`);
      } else {
        postPetMutation.mutate(submitData);
        setModalVisible(false);
        Alert.alert('Complete', `반려견 등록이 완료되었습니다`);
      }
    } else {
      Alert.alert('Error', '로그인 해주세요');
    }
  };

  return (
    <Container>
      {petData && <ImagePicker petData={petData} onPress={handlePressImage} />}

      <InputContainer>
        <CustomInputField
          placeholder="반려견 이름"
          error={inputUser.errors.petName}
          touched={inputUser.touched.petName}
          {...inputUser.getTextInputProps('petName')}
        />
        <CustomInputField
          placeholder="생년월일 (yyyy-mm-dd)"
          error={inputUser.errors.petBirth}
          touched={inputUser.touched.petBirth}
          {...inputUser.getTextInputProps('petBirth')}
        />
        <CustomInputField
          placeholder="몸무게 (g)"
          error={inputUser.errors.petWeight}
          touched={inputUser.touched.petWeight}
          inputMode="numeric"
          keyboardType="number-pad"
          {...inputUser.getTextInputProps('petWeight')}
        />
        <RadioButtonGroup selected={inputUser.values.petGender} onSelected={handleRadioChange}>
          {[
            { label: '남아', key: 'MALE' },
            { label: '여아', key: 'FEMALE' },
          ].map((radio) => (
            <RadioButtonGroup.RadioButtonItem key={radio.key} value={radio.key}>
              <Text>{radio.label}</Text>
            </RadioButtonGroup.RadioButtonItem>
          ))}
        </RadioButtonGroup>
        <CustomButton
          label={`${petData ? '변경' : '등록'} 완료`}
          onPress={handleSubmit}
          inValid={!inputUser.isValid}
        />
      </InputContainer>
    </Container>
  );
};

const Container = styled.View`
  justify-content: center;
  padding: 20px;
`;

const InputContainer = styled.View`
  gap: 30px;
`;

export default PetForm;
