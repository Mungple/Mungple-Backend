import React from 'react';
import {authNavigations} from '@/constants';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import AuthHomeScreen from '@/screens/auth/AuthHomeScreen';
import KakaoLoginScreen from '@/screens/auth/KakaoLoginScreen';
import NaverLoginScreen from '@/screens/auth/NaverLoginScreen';
import GoogleLoginScreen from '@/screens/auth/GoogleLoginScreen';

export type AuthStackParamList = {
  [authNavigations.AUTH_HOME]: undefined;
  [authNavigations.KAKAO]: undefined;
  [authNavigations.NAVER]: undefined;
  [authNavigations.GOOGLE]: undefined;
};

const Stack = createNativeStackNavigator<AuthStackParamList>();

const AuthStackNavigator: React.FC = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name={authNavigations.AUTH_HOME}
        component={AuthHomeScreen}
        options={{
          headerTitle: ' ',
          headerShown: false,
        }}
      />
      <Stack.Screen
        name={authNavigations.KAKAO}
        component={KakaoLoginScreen}
        options={{
          headerTitle: '카카오 로그인',
        }}
      />
      <Stack.Screen
        name={authNavigations.NAVER}
        component={NaverLoginScreen}
        options={{
          headerTitle: '네이버 로그인',
        }}
      />
      <Stack.Screen
        name={authNavigations.GOOGLE}
        component={GoogleLoginScreen}
        options={{
          headerTitle: '구글 로그인',
        }}
      />
    </Stack.Navigator>
  );
}

export default AuthStackNavigator;
