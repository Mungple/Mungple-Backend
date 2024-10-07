import React from 'react';
import { ScrollView } from 'react-native';
import styled from 'styled-components/native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { SettingStackParamList } from '@/navigations/stack/SettingStackNavigator';
import { removeHeader } from '@/utils';
import { useAppStore } from '@/state/useAppStore';
import { settingNavigations } from '@/constants';
import SettingItem from '@/components/setting/SettingItem';

const SettingScreen = () => {
  const setLogin = useAppStore((state) => state.setLogin);
  const navigation = useNavigation<NativeStackNavigationProp<SettingStackParamList>>();

  const handleProfilePress = () => {
    navigation.navigate(settingNavigations.EDIT_PROFILE);
  };

  const handleLogoutPress = () => {
    removeHeader('Authorization');
    setLogin(false);
  };

  return (
    <Container>
      <ScrollView>
        <SettingItem title="프로필 사진 변경" onPress={handleProfilePress} />
        <SettingItem title="로그아웃" onPress={handleLogoutPress} />
      </ScrollView>
    </Container>
  );
};

const Container = styled.SafeAreaView`
  flex: 1;
`;

export default SettingScreen;
