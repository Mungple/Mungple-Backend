import React from 'react';
import { authNavigations } from '@/constants';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import AuthHomeScreen from '@/screens/auth/AuthHomeScreen';
import SocialLoginScreen from '@/screens/auth/SocialLoginScreen';
import SplashScreen from '@/screens/home/SplashScreen';
import EasterEggScreen from '@/screens/user/EasterEggScreen';

export type AuthStackParamList = {
  [authNavigations.AUTH_HOME]: undefined;
  [authNavigations.SPLASH]: undefined
  [authNavigations.SOCIAL_LOGIN]: undefined;
  [authNavigations.POST_PROFILE]: undefined;
  [authNavigations.POST_PROFILE_PET]: undefined;
  [authNavigations.EASTER_EGG]: undefined;
};

const Stack = createNativeStackNavigator<AuthStackParamList>();

const AuthStackNavigator: React.FC = () => {
  return (
    <Stack.Navigator initialRouteName="SplashScreen" screenOptions={{ headerShown: false }}>
      <Stack.Screen name={authNavigations.SPLASH} component={SplashScreen} />
      <Stack.Screen name={authNavigations.AUTH_HOME} component={AuthHomeScreen} />
      <Stack.Screen name={authNavigations.SOCIAL_LOGIN} component={SocialLoginScreen} />
      <Stack.Screen
        name={authNavigations.EASTER_EGG}
        component={EasterEggScreen}
        options={{ headerShown: true, headerTitle: '왈왈' }}
      />
    </Stack.Navigator>
  );
};

export default AuthStackNavigator;
