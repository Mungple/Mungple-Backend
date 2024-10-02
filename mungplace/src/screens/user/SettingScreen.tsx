import React from 'react'
import {ScrollView} from 'react-native'
import styled from 'styled-components/native'

import useAuth from '@/hooks/queries/useAuth'
import {useAppStore} from '@/state/useAppStore'
import {useNavigation} from '@react-navigation/native'
import {colors, settingNavigations} from '@/constants'
import SettingItem from '@/components/setting/SettingItem'
import {NativeStackNavigationProp} from '@react-navigation/native-stack'
import {SettingStackParamList} from '@/navigations/stack/SettingStackNavigator'

const SettingScreen = () => {
  const {logoutMutation} = useAuth()
  const setLogin = useAppStore(state => state.setLogin)
  const navigation = useNavigation<NativeStackNavigationProp<SettingStackParamList>>()

  const handleProfilePress = () => {
    navigation.navigate(settingNavigations.EDIT_PROFILE)
  }

  const handleLogoutPress = () => {
    logoutMutation.mutate(null)
    setLogin(false)
  }

  return (
    <Container>
      <ScrollView>
        <Space />
        <SettingItem title="프로필 사진 변경" onPress={handleProfilePress} />
        <SettingItem title="로그아웃" onPress={handleLogoutPress} color={colors.RED.DARKER} />
      </ScrollView>
    </Container>
  )
}

const Container = styled.SafeAreaView`
  flex: 1;
`

const Space = styled.View`
  height: 30px;
`

export default SettingScreen
