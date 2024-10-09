import React from 'react';
import styled from 'styled-components/native';
import { WebView, WebViewNavigation } from 'react-native-webview';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import useAuth from '@/hooks/queries/useAuth';
import { useAppStore } from '@/state/useAppStore';
import { AuthStackParamList } from '@/navigations/stack/AuthStackNavigator';
import { convertToObject } from 'typescript';

type SocialLoginScreenProps = NativeStackScreenProps<AuthStackParamList, 'SocialLogin'>;
type CustomWebViewNavigation = Omit<WebViewNavigation, 'headers'>;
const domain = 'https://j11e106.p.ssafy.io';

const SocialLoginScreen: React.FC<SocialLoginScreenProps> = () => {
  const { loginMutation } = useAuth();
  const { setLogin } = useAppStore.getState();

  const handleNavigationStateChange = (event: CustomWebViewNavigation) => {
    const url = event.url;
    console.log(url)

    if (url.startsWith(`${domain}/api/auth/oauth-response`)) {
      loginMutation.mutate(url);
      setLogin(true);
    }
  };

  return (
    <Container>
      <WebView
        style={{ flex: 1 }}
        source={{ uri: `${domain}/api/users/login/kakao` }}
        onNavigationStateChange={handleNavigationStateChange}
      />
    </Container>
  );
};

const Container = styled.SafeAreaView`
  flex: 1;
`;

export default SocialLoginScreen;
