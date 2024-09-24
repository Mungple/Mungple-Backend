import React, {useState} from 'react';
import styled from 'styled-components/native';
import {WebView, WebViewNavigation} from 'react-native-webview';
import {NativeStackScreenProps} from '@react-navigation/native-stack';

import {useAppStore} from '@/state/useAppStore';
import {AuthStackParamList} from '@/navigations/stack/AuthStackNavigator';
import {setHeader} from '@/utils';

type SocialLoginScreenProps = NativeStackScreenProps<
  AuthStackParamList,
  'SocialLogin'
>;

const SocialLoginScreen: React.FC<SocialLoginScreenProps> = ({route}) => {
  const {provider} = route.params;
  const setLogin = useAppStore(state => state.setLogin);
  const setToken = useAppStore(state => state.setToken);

  const getCallbackPath = (provider: string, domain: string = 'localhost') => {
    return `http://${domain}:8080/oauth2/callback/${provider}`;
  };
  const [nowPath, setNowPath] = useState<string>(
    `http://10.0.2.2:8080/api/users/login/${provider}`
  );

  const handleNavigationStateChange = (event: WebViewNavigation) => {
    const url = event.url;
    setNowPath(url);

    if (url.startsWith(`${getCallbackPath(provider)}?code=`)) {
      const queryParams = url.split('?')[1];
      setNowPath(`${getCallbackPath(provider, '10.0.2.2')}?${queryParams}`);
    } else if (url.startsWith(`http://localhost:8080/auth/oauth-response/`)) {
      const pathSegments = url.split('/');
      const accessToken = pathSegments[pathSegments.length - 1];

      setHeader('Authorization', `Bearer ${accessToken}`);
      setHeader('Content-Type', `application/json; charset=utf8`);
      setToken(accessToken);
      setLogin(true);
    }
  };

  return (
    <Container>
      <WebViewContainer
        source={{uri: nowPath}}
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
