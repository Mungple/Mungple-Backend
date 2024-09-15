import axios from 'axios';
import React, {useState} from 'react';
import Config from 'react-native-config';
import {WebView, WebViewMessageEvent, WebViewNavigation} from 'react-native-webview';
import {ActivityIndicator, Dimensions, SafeAreaView, StyleSheet, View} from 'react-native';

import {colors} from '@/constants';
import useAuth from '@/hooks/queries/useAuth';

// 카카오 로그인 후 리다이렉트될 URL 설정
const REDIRECT_URI = `http://10.0.2.2:3030/auth/oauth/kakao`;

// WebView에서 메시지를 보내기 위한 JavaScript 코드
const INJECTED_JAVASCRIPT = "window.ReactNativeWebView.postMessage('')";

function KakaoLoginScreen() {
  const {kakaoLoginMutation} = useAuth(); // 인증 관련 훅 사용 (카카오 로그인 상태 변경을 위한 mutation)
  const [isChangeNavigate, setIsChangeNavigate] = useState(true); // 네비게이션 상태를 추적하는 state
  const [isLoading, setIsLoading] = useState(false); // 로딩 상태를 추적하는 state

  // WebView에서 메시지가 전달될 때 호출되는 함수
  const handleOnMessage = (event: WebViewMessageEvent) => {
    // 리다이렉트 URI와 함께 code 값이 전달되면 처리
    if (event.nativeEvent.url.includes(`${REDIRECT_URI}?code=`)) {
      // code 파라미터를 추출
      const code = event.nativeEvent.url.replace(`${REDIRECT_URI}?code=`, '');

      // 추출된 code로 토큰 요청
      requestToken(code);
    }
  };

  // 카카오 서버로부터 인증 코드를 받은 후, 액세스 토큰을 요청하는 함수
  const requestToken = async (code: string) => {
    const response = await axios({
      method: 'post',
      url: 'https://kauth.kakao.com/oauth/token',
      params: {
        grant_type: 'authorization_code',
        client_id: Config.KAKAO_REST_API_KEY,
        redirect_uri: REDIRECT_URI,
        code,
      },
    });

    // 받은 액세스 토큰을 서버에 전달해 로그인 처리
    kakaoLoginMutation.mutate(response.data.access_token);
  };

  // WebView의 네비게이션 상태가 변경될 때 호출되는 함수
  const handleNavigationStateChange = (event: WebViewNavigation) => {
    // 리다이렉트 URL에 code가 포함되어 있으면 로딩 상태로 전환
    const isMatched = event.url.includes(`${REDIRECT_URI}?code=`);
    setIsLoading(isMatched); // 로딩 상태 업데이트
    setIsChangeNavigate(event.loading); // 네비게이션 상태 업데이트
  };

  return (
    <SafeAreaView style={styles.container}>
      {(isChangeNavigate || isLoading) && (
        <View style={styles.kakaoLoadingContiner}>
          <ActivityIndicator size={'small'} color={colors.BLACK} />
        </View>
      )}
      <WebView
        style={styles.container}
        source={{
          // 카카오 로그인 인증 페이지 URI
          uri: `https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=${Config.KAKAO_REST_API_KEY}&redirect_uri=${REDIRECT_URI}`,
        }}
        onMessage={handleOnMessage} // WebView에서 메시지 수신 시 처리
        injectedJavaScript={INJECTED_JAVASCRIPT} // WebView에 삽입할 JavaScript
        onNavigationStateChange={handleNavigationStateChange} // 네비게이션 상태가 변경될 때 처리
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  kakaoLoadingContiner: {
    backgroundColor: colors.WHITE,
    height: Dimensions.get('window').height,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default KakaoLoginScreen;
