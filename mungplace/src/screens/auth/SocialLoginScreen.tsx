import React from 'react';
import styled from 'styled-components/native';
import {WebView, WebViewNavigation} from 'react-native-webview';
import {NativeStackScreenProps} from '@react-navigation/native-stack';

import useAuth from '@/hooks/queries/useAuth';
import {useAppStore} from '@/state/useAppStore';
import {AuthStackParamList} from '@/navigations/stack/AuthStackNavigator';

type SocialLoginScreenProps = NativeStackScreenProps<
  AuthStackParamList,
  'SocialLogin'
>;

const SocialLoginScreen: React.FC<SocialLoginScreenProps> = ({route}) => {
  const {provider} = route.params;
  const {setLogin} = useAppStore();
  const {loginMutation} = useAuth();

  const handleNavigationStateChange = (event: WebViewNavigation) => {
    const url = event.url;
    if (url.startsWith(`https://j11e106.p.ssafy.io/api/auth/oauth-response`)) {
      loginMutation.mutate(url);
      setLogin(true);
    }
  };

  return (
    <Container>
      <WebViewContainer
        source={{uri: `https://j11e106.p.ssafy.io/api/users/login/${provider}`}}
        onNavigationStateChange={handleNavigationStateChange}
      />
    </Container>
  );
};

const Container = styled.SafeAreaView`
  flex: 1;
`;

const WebViewContainer = styled(WebView)`
  flex: 1;
`;

export default SocialLoginScreen;
