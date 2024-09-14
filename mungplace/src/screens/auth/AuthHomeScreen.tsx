import React from 'react';
import {SafeAreaView, StyleSheet, Dimensions, Image, View} from 'react-native';

import imageSource from '@/assets/mungple_logo.png'
import CustomButton from '@/components/common/CustomButton';

import {authNavigations} from '@/constants';
import {AuthStackParamList} from '@/navigations/stack/AuthStackNavigator';
import {NativeStackScreenProps} from '@react-navigation/native-stack';

type AuthHomeScreenProps = NativeStackScreenProps<
  AuthStackParamList,
  typeof authNavigations.AUTH_HOME
>;

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
          onPress={() => navigation.navigate(authNavigations.KAKAO)}
          style={styles.kakaoButtonContainer}
          textStyle={styles.buttonText}
        />
        <CustomButton
          label="네이버 로그인하기"
          onPress={() => navigation.navigate(authNavigations.NAVER)}
          style={styles.naverButtonContainer}
          textStyle={styles.buttonText}
        />
        <CustomButton
          label="구글 로그인하기"
          onPress={() => navigation.navigate(authNavigations.GOOGLE)}
          style={styles.googleButtonContainer}
          textStyle={styles.buttonText}
        />
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
