import React from 'react';
import styled from 'styled-components/native';
import {NativeStackNavigationProp, NativeStackScreenProps} from '@react-navigation/native-stack';

import {authNavigations} from '@/constants';
import {useNavigation} from '@react-navigation/native';
import CustomButton from '@/components/common/CustomButton';
import {AuthStackParamList} from '@/navigations/stack/AuthStackNavigator';

type GoogleLoginScreenProps = NativeStackScreenProps<AuthStackParamList>;

const GoogleLoginScreen = ({navigation}: GoogleLoginScreenProps) => {
  return (
    <Container>
      <CustomButton
        label="로그인하기"
        onPress={() => navigation.navigate(authNavigations.POST_PROFILE)}
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
