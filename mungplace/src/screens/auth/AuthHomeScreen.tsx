import React from 'react';
import {SafeAreaView, StyleSheet, Dimensions, Image, View} from 'react-native';

import imageSource from '@/assets/mungple_logo.png'
import Ionicons from 'react-native-vector-icons/Ionicons';
import CustomButton from '@/components/common/CustomButton';

import {authNavigations} from '@/constants';
import {AuthStackParamList} from '@/navigations/stack/AuthStackNavigator';
import {NativeStackScreenProps} from '@react-navigation/native-stack';

const AuthHomeScreen = () => {
  const [naverLoginResponse, setNaverLoginResponse] = useState<NaverLoginResponse | null>(null);
  const [kakaoLoginResponse, setKakaoLoginResponse] = useState<KakaoOAuthToken | null>(null);
  const [kakaoProfile, setKakaoProfile] = useState<KakaoProfile | null>(null);

  // SDK 초기화
  useEffect(() => {
    NaverLogin.initialize({
      appName: 'com.mungplace',
      consumerKey: `${process.env.NAVER_CUSTOMER_KEY}`,
      consumerSecret: `${process.env.NAVER_CUSTOMER_SECRET}`,
    });
  }, []);

  // 네이버 로그인 함수
  const handleNaverLogin = async () => {
    try {
      const response = await NaverLogin.login();
      setNaverLoginResponse(response);
      console.log(response)
    } catch (err) {
      console.log(err);
    }
  };

  // 카카오 로그인 함수
  const handleKakaoLogin = async () => {
    try {
      const token = await NativeKakaoLogins.loginWithKakaoAccount();
      setKakaoLoginResponse(token);

      const profile = await NativeKakaoLogins.getProfile();
      setKakaoProfile(profile);
    } catch (err) {
      console.log('Kakao login error:', err);
    }
  };

const AuthHomeScreen: React.FC<AuthHomeScreenProps> = ({navigation}) => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.imageContainer}>
        <Image
          resizeMode="contain"
          style={styles.image}
          source={imageSource}
        />
      </View>

      <View style={styles.buttonContainer}>
        <CustomButton
          label="카카오 로그인하기"
          onPress={handleKakaoLogin}
          style={styles.kakaoButtonContainer}
          textStyle={styles.buttonText}
          icon={
            <Ionicons name={'chatbubble-sharp'} color={'#181600'} size={16} />
          }
        />
        <CustomButton
          label="네이버 로그인하기"
          onPress={handleNaverLogin}
          style={styles.naverButtonContainer}
          textStyle={styles.buttonText}
        />
        <CustomButton
          label="구글 로그인하기"
          // onPress={()}
          style={styles.googleButtonContainer}
          textStyle={styles.buttonText}
        />
        {/* 네이버 로그인 결과 표시 */}
        {naverLoginResponse && (
          <View>
            <Text>
              네이버 로그인 성공:{' '}
              {naverLoginResponse.successResponse?.accessToken}
            </Text>
            <Text>
              {naverLoginResponse.successResponse?.accessToken}
            </Text>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1.5,
    alignItems: 'center',
    marginHorizontal: 30,
    marginVertical: 30,
  },
  imageContainer: {
    alignItems: 'center',
    flex: 1,
    width: (Dimensions.get('screen').width * 3) / 5,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  buttonContainer: {
    flex: 1,
    alignItems: 'center',
    gap: 10,
  },
  buttonText: {
    color: '#000000',
  },
  kakaoButtonContainer: {
    backgroundColor: '#FEE503',
    borderRadius: 0,
  },
  naverButtonContainer: {
    backgroundColor: '#19CE60',
    borderRadius: 0,
  },
  googleButtonContainer: {
    backgroundColor: '#FFFFFF',
    borderStyle: 'solid',
    borderWidth: 1,
    borderRadius: 0,
    borderColor: '#000000',
  },
});

export default AuthHomeScreen;
