import React, {useState} from 'react'
import styled from 'styled-components/native'
import {Dimensions, TextInput, TouchableOpacity} from 'react-native'
import {NativeStackScreenProps} from '@react-navigation/native-stack'
import {managerLogin} from '@/components/common/ManagerLogin'
import {authNavigations} from '@/constants'
import Logo from '@/assets/mungple_logo.png'
import kakaoLogo from '@/assets/kakao_login_button.png'
import naverLogo from '@/assets/naver_login_button.png'
import googleLogo from '@/assets/google_login_button.png'
import {AuthStackParamList} from '@/navigations/stack/AuthStackNavigator'
import CustomButton from '@/components/common/CustomButton'

type AuthHomeScreenProps = NativeStackScreenProps<
  AuthStackParamList,
  typeof authNavigations.AUTH_HOME
>

const width = Dimensions.get('screen').width

const AuthHomeScreen: React.FC<AuthHomeScreenProps> = ({navigation}) => {
  const [username, setUsername] = useState('')

  const handleLoginPress = () => {
    if (username.trim()) {
      managerLogin(username)
    } else {
      console.error('유저이름은 필수입니다')
    }
  }
  return (
    <Container>
      <LogoContainer>
        <LogoImage source={Logo} />
      </LogoContainer>

      <ButtonsContainer>
        <LoginButton
          onPress={() => navigation.navigate(authNavigations.SOCIAL_LOGIN, {provider: 'kakao'})}>
          <ButtonImage source={kakaoLogo} />
        </LoginButton>

        <LoginButton
          onPress={() => navigation.navigate(authNavigations.SOCIAL_LOGIN, {provider: 'naver'})}>
          <ButtonImage source={naverLogo} />
        </LoginButton>

        <LoginButton
          onPress={() => navigation.navigate(authNavigations.SOCIAL_LOGIN, {provider: 'google'})}>
          <ButtonImage source={googleLogo} />
        </LoginButton>
        <TextInput value={username} onChangeText={setUsername} placeholder="매니저 이름" />
        <CustomButton label="매니저 로그인" onPress={handleLoginPress} />
      </ButtonsContainer>
    </Container>
  )
}

const Container = styled.SafeAreaView`
  flex: 1.5;
  margin: 20px;
  align-items: center;
  justify-content: center;
`

const LogoContainer = styled.View`
  width: ${width * 0.6}px;
  height: ${width * 0.6}px;
  margin-bottom: 40px;
`

const LogoImage = styled.Image`
  width: 100%;
  height: 100%;
  resizemode: contain;
`

const ButtonsContainer = styled.View`
  width: 100%;
  align-items: center;
`

const LoginButton = styled(TouchableOpacity)`
  width: 100%;
  align-items: center;
`

const ButtonImage = styled.Image`
  width: ${width - 60}px;
  height: ${width * 0.18}px;
  resizemode: contain;
`

export default AuthHomeScreen
