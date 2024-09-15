import React from 'react';
import styled from 'styled-components/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';

import {authNavigations} from '@/constants';
import CustomButton from '@/components/common/CustomButton';
import {AuthStackParamList} from '@/navigations/stack/AuthStackNavigator';
import { useNavigation } from '@react-navigation/native';

const GoogleLoginScreen: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<AuthStackParamList>>()

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
