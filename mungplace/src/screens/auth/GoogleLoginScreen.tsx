import React from 'react';
import styled from 'styled-components/native';
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
    <Container>
      <CustomButton
        label="로그인하기"
        onPress={() => navigation.navigate(authNavigations.INPUT_USER)}
      />
    </Container>
  );
};

const Container = styled.SafeAreaView`
  flex: 1;
  justify-content: center;
  padding: 20px;
`

export default GoogleLoginScreen;
