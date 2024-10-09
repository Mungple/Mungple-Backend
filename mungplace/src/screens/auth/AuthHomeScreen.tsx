import React, { useState } from 'react';
import styled from 'styled-components/native';
import { Dimensions, Image, TextInput } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { managerLogin } from '@/components/common/ManagerLogin';
import { authNavigations } from '@/constants';
import Logo from '@/assets/mungpleAppLogo.png';
import kakaoLogo from '@/assets/kakao_login_button.png';
import { AuthStackParamList } from '@/navigations/stack/AuthStackNavigator';
import CustomButton from '@/components/common/CustomButton';
import CustomText from '@/components/common/CustomText';

type AuthHomeScreenProps = NativeStackScreenProps<
  AuthStackParamList,
  typeof authNavigations.AUTH_HOME
>;

const width = Dimensions.get('screen').width;

const AuthHomeScreen: React.FC<AuthHomeScreenProps> = ({ navigation }) => {
  const [username, setUsername] = useState('');

  const handleLoginPress = () => {
    if (username.trim()) {
      managerLogin(username);
    } else {
      console.error('유저이름은 필수입니다');
    }
  };
  return (
    <Container>
      <LogoContainer>
        <Image source={Logo} style={{ height: 100, resizeMode: 'contain' }} />
        <CustomText fontWeight={'bold'} fontSize={36}>
          mungple
        </CustomText>
        <CustomText style={{ marginTop: 15, marginBottom: 50 }}>
          반려견과 즐거운 산책을 시작해보세요!
        </CustomText>
      </LogoContainer>

      <ButtonsContainer>
        <LoginButton onPress={() => navigation.navigate(authNavigations.SOCIAL_LOGIN)}>
          <ButtonImage source={kakaoLogo} />
        </LoginButton>

        <TextInput value={username} onChangeText={setUsername} placeholder="매니저 이름" />
        <CustomButton label="매니저 로그인" onPress={handleLoginPress} />
      </ButtonsContainer>
    </Container>
  );
};

const Container = styled.SafeAreaView`
  flex: 1;
  padding: 20px;
  align-items: center;
  justify-content: center;
`;

const LogoContainer = styled.View`
  align-items: center;
  justify-content: center;
  width: ${width * 0.6}px;
  resizemode: contain;
`;

const ButtonsContainer = styled.View`
  width: 100%;
  align-items: center;
  justify-content: flex-start;
`;

const LoginButton = styled.TouchableOpacity`
  width: 100%;
  align-items: center;
`;

const ButtonImage = styled.Image`
  width: ${width - 60}px;
  height: ${width * 0.18}px;
  resizemode: contain;
`;

export default AuthHomeScreen;
