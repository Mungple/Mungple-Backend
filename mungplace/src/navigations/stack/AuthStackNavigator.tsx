import React from 'react';
import {authNavigations} from '@/constants';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import PostProfilePet from '@/screens/user/PostProfilePet';
import AuthHomeScreen from '@/screens/auth/AuthHomeScreen';
import SocialLoginScreen from '@/screens/auth/SocialLoginScreen';
import PostProfileScreen from '@/screens/user/PostProfileScreen';

export type AuthStackParamList = {
  [authNavigations.AUTH_HOME]: undefined;
  [authNavigations.SOCIAL_LOGIN]: {provider: 'naver' | 'kakao' | 'google'};
  [authNavigations.POST_PROFILE]: undefined;
  [authNavigations.POST_PROFILE_PET]: undefined;
};

const Stack = createNativeStackNavigator<AuthStackParamList>();

const AuthStackNavigator: React.FC = () => {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name={authNavigations.AUTH_HOME} component={AuthHomeScreen} />
      <Stack.Screen name={authNavigations.SOCIAL_LOGIN} component={SocialLoginScreen} />
      <Stack.Screen name={authNavigations.POST_PROFILE} component={PostProfileScreen} />
      <Stack.Screen name={authNavigations.POST_PROFILE_PET} component={PostProfilePet} />
    </Stack.Navigator>
  );
};

export default AuthStackNavigator;
