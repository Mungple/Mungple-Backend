import {View} from 'react-native';
import React from 'react';

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
  return (
    <View>
      <CustomInputField placeholder="반려견 이름" />
      <CustomInputField placeholder="생년월일" />
      <CustomInputField placeholder="성별" />
      <CustomInputField placeholder="몸무게" />
      <CustomButton
        label="로그인하기"
        onPress={() => navigation.navigate(authNavigations.AUTH_HOME)}
      />
    </View>
  );
};

export default InputPetScreen;
