import React from 'react';
import {View} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';

import {authNavigations} from '@/constants';
import CustomButton from '@/components/common/CustomButton';
import {AuthStackParamList} from '@/navigations/stack/AuthStackNavigator';

type GoogleLoginScreenProps = NativeStackScreenProps<
  AuthStackParamList,
  typeof authNavigations.GOOGLE
>;

const GoogleLoginScreen: React.FC<GoogleLoginScreenProps> = ({navigation}) => {
  return (
    <View>
      <CustomButton
        label="로그인하기"
        onPress={() => navigation.navigate(authNavigations.INPUT_USER)}
      />
    </View>
  );
};

export default GoogleLoginScreen;
