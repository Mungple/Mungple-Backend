import React, {useState} from 'react';
import styled from 'styled-components/native';
import {WebView, WebViewNavigation} from 'react-native-webview';
import {NativeStackScreenProps} from '@react-navigation/native-stack';

import {authNavigations} from '@/constants';
import useAuth from '@/hooks/queries/useAuth';
import {AuthStackParamList} from '@/navigations/stack/AuthStackNavigator';

type SocialLoginScreenProps = NativeStackScreenProps<
  AuthStackParamList,
  'SocialLogin'
>;

const SocialLoginScreen: React.FC<SocialLoginScreenProps> = ({route, navigation}) => {
  const {provider} = route.params;
  const {socialLoginMutation} = useAuth();
  const getAuthUrl = (provider: string) => `http://10.0.2.2:8080/api/users/login/${provider}`;
  const getCallbackUrl = (provider: string, domain: string = 'localhost') => {
    return `http://${domain}:8080/oauth2/callback/${provider}`;
  };
  const getTokenUrl =  `http://localhost:8080/auth/oauth-response/`;
  const [currentUrl, setCurrentUrl] = useState<string>(getAuthUrl(provider));

  const handleNavigationStateChange = (event: WebViewNavigation) => {
    const url = event.url;
    setCurrentUrl(url);

    if (url.startsWith(`${getCallbackUrl(provider)}?code=`)) {
      const queryParams = url.split('?')[1];
      setCurrentUrl(`${getCallbackUrl(provider, '10.0.2.2')}?${queryParams}`);
    } else if (url.startsWith(getTokenUrl)) {
      const pathSegments = url.split('/');
      const token = pathSegments[pathSegments.length - 1];
      socialLoginMutation.mutate(token);
      navigation.navigate(authNavigations.POST_PROFILE);
    }
  };

  return (
    <Container>
      <WebViewContainer
        source={{uri: currentUrl}}
        onNavigationStateChange={handleNavigationStateChange}
        startInLoadingState
        javaScriptEnabled
        domStorageEnabled
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
