import React from 'react';
import styled from 'styled-components/native';
import {Dimensions, TouchableOpacity} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';

import {authNavigations} from '@/constants';
import Logo from '@/assets/mungple_logo.png';
import kakaoLogo from '@/assets/kakao_login_button.png';
import naverLogo from '@/assets/naver_login_button.png';
import googleLogo from '@/assets/google_login_button.png';
import {AuthStackParamList} from '@/navigations/stack/AuthStackNavigator';
import CustomButton from '@/components/common/CustomButton';
import { useAppStore } from '@/state/useAppStore';

type AuthHomeScreenProps = NativeStackScreenProps<AuthStackParamList, typeof authNavigations.AUTH_HOME>;

const width = Dimensions.get('screen').width

const AuthHomeScreen: React.FC<AuthHomeScreenProps> = ({navigation}) => {
  const setLogin = useAppStore((state) => state.setLogin);
  return (
    <Container>
      <LogoContainer >
        <LogoImage source={Logo} />
      </LogoContainer >

      <ButtonsContainer>
        <LoginButton onPress={() => navigation.navigate(authNavigations.SOCIAL_LOGIN, {provider:'kakao'})}>
          <ButtonImage source={kakaoLogo} />
        </LoginButton>

        <LoginButton onPress={() => navigation.navigate(authNavigations.SOCIAL_LOGIN, {provider:'naver'})}>
          <ButtonImage source={naverLogo} />
        </LoginButton>

        <LoginButton onPress={() => navigation.navigate(authNavigations.SOCIAL_LOGIN, {provider:'google'})}>
          <ButtonImage source={googleLogo} />
        </LoginButton>
        
        <CustomButton label='빠른 로그인' onPress={() => {setLogin(true)}} />
      </ButtonsContainer>
    </Container>
  );
};

const Container = styled.SafeAreaView`
  flex: 1.5;
  margin: 20px;
  align-items: center;
  justify-content: center;
`

const LogoContainer = styled.View`
  width: ${width * 0.6}px;
  height: ${width * 0.6}px;
  margin-bottom: 40px;
`;

const LogoImage = styled.Image`
  width: 100%;
  height: 100%;
  resizeMode: contain;
`

const ButtonsContainer  = styled.View`
  width: 100%;
  align-items: center;
`

const LoginButton = styled(TouchableOpacity)`
  width: 100%;
  align-items: center;
`;

const ButtonImage = styled.Image`
  width: ${width - 60}px;
  height: ${width * 0.18}px;
  resizeMode: contain;
`;

export default AuthHomeScreen;
