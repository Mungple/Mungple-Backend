import React from 'react';
import {View} from 'react-native';

import { authNavigations } from '@/constants';
import CustomButton from '@/components/common/CustomButton';
import CustomInputField from '@/components/common/CustomInputField';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {AuthStackParamList} from '@/navigations/stack/AuthStackNavigator';

type AuthHomeScreenProps = NativeStackScreenProps<
  AuthStackParamList,
  typeof authNavigations.AUTH_HOME
>;

const InputUserScreen: React.FC<AuthHomeScreenProps> = ({navigation}) => {
  return (
    <View>
      <CustomInputField placeholder='닉네임'/>
      <CustomButton
        label="등록하기"
        onPress={() => navigation.navigate(authNavigations.INPUT_PET)}
      />
    </View>
  );
};

export default InputUserScreen;
