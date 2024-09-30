import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import {ResponsePetProfile} from '@/types';
import {settingNavigations} from '@/constants';
import MyPageScreen from '@/screens/user/MyPageScreen';
import SettingScreen from '@/screens/user/SettingScreen';
import PetDetailScreen from '@/screens/user/PetDetailScreen';
import EditProfileScreen from '@/screens/user/EditProfileScreen';

export type SettingStackParamList = {
  [settingNavigations.SETTING]: undefined;
  [settingNavigations.MY_PAGE]: undefined;
  [settingNavigations.PET_DETAIL]: {petData: ResponsePetProfile};
  [settingNavigations.EDIT_PROFILE]: undefined;
  [settingNavigations.DELETE_ACCOUNT]: undefined;
};

const Stack = createNativeStackNavigator<SettingStackParamList>();

function SettingStackNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name={settingNavigations.MY_PAGE}
        component={MyPageScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name={settingNavigations.SETTING}
        component={SettingScreen}
        options={{
          headerTitle: '설정',
        }}
      />
      <Stack.Screen
        name={settingNavigations.EDIT_PROFILE}
        component={EditProfileScreen}
        options={{
          headerTitle: '프로필 편집',
        }}
      />
      <Stack.Screen
        name={settingNavigations.PET_DETAIL}
        component={PetDetailScreen}
        options={{
          headerTitle: '반려견 상세',
        }}
      />
    </Stack.Navigator>
  );
}

export default SettingStackNavigator;
