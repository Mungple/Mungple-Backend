import React from 'react';
import { NavigationProp } from '@react-navigation/core';
import { useNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import IonIcons from 'react-native-vector-icons/Ionicons';
import { ResponsePetProfile } from '@/types';
import { settingNavigations } from '@/constants';
import { colors } from '@/constants';
import MyPageScreen from '@/screens/user/MyPageScreen';
import SettingScreen from '@/screens/user/SettingScreen';
import PetDetailScreen from '@/screens/user/PetDetailScreen';
import EditProfileScreen from '@/screens/user/EditProfileScreen';

export type SettingStackParamList = {
  [settingNavigations.SETTING]: undefined;
  [settingNavigations.MY_PAGE]: undefined;
  [settingNavigations.PET_DETAIL]: { petData: ResponsePetProfile };
  [settingNavigations.EDIT_PROFILE]: undefined;
  [settingNavigations.DELETE_ACCOUNT]: undefined;
};

const SettingStack = createNativeStackNavigator<SettingStackParamList>();

function SettingStackNavigator() {
  const navigation = useNavigation<NavigationProp<SettingStackParamList>>();

  return (
    <SettingStack.Navigator
      screenOptions={{
        headerTitleStyle: { fontFamily: 'OTLaundryGothicB', fontSize: 24 },
      }}>
      <SettingStack.Screen
        name={settingNavigations.MY_PAGE}
        component={MyPageScreen}
        options={{
          headerTitle: '내 정보',
          headerRight: () => (
            <IonIcons
              name={'settings-outline'}
              size={32}
              color={colors.BLACK}
              onPress={() => navigation.navigate(settingNavigations.SETTING)}
            />
          ),
        }}
      />
      <SettingStack.Screen
        name={settingNavigations.SETTING}
        component={SettingScreen}
        options={{
          headerTitle: '설정',
        }}
      />
      <SettingStack.Screen
        name={settingNavigations.EDIT_PROFILE}
        component={EditProfileScreen}
        options={{
          headerTitle: '프로필 편집',
        }}
      />
      <SettingStack.Screen
        name={settingNavigations.PET_DETAIL}
        component={PetDetailScreen}
        options={{
          headerTitle: '반려견 상세',
        }}
      />
    </SettingStack.Navigator>
  );
}

export default SettingStackNavigator;
