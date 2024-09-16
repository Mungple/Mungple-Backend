import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import {settingNavigations} from '@/constants';
import SettingHomeScreen from '@/screens/setting/SettingHomeScreen';
import EditProfileScreen from '@/screens/setting/EditProfileScreen';
import EditCategoryScreen from '@/screens/setting/EditCategoryScreen';
import SettingHeaderLeft from '@/components/setting/SettingHeaderLeft';
import DeleteAccountScreen from '@/screens/setting/DeleteAccountScreen';

export type SettingStackParamList = {
  [settingNavigations.SETTING_HOME]: undefined;
  [settingNavigations.EDIT_PROFILE]: undefined;
  [settingNavigations.DELETE_ACCOUNT]: undefined;
  [settingNavigations.EDIT_CATEGORY]: undefined;
};

const Stack = createNativeStackNavigator<SettingStackParamList>();

function SettingStackNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name={settingNavigations.SETTING_HOME}
        component={SettingHomeScreen}
        options={({navigation}) => ({
          headerTitle: '설정',
        })}
      />
      <Stack.Screen
        name={settingNavigations.EDIT_PROFILE}
        component={EditProfileScreen}
        options={{
          headerTitle: '프로필 수정',
        }}
      />
      <Stack.Screen
        name={settingNavigations.DELETE_ACCOUNT}
        component={DeleteAccountScreen}
        options={{
          headerTitle: '회원탈퇴',
        }}
      />
      <Stack.Screen
        name={settingNavigations.EDIT_CATEGORY}
        component={EditCategoryScreen}
        options={{
          headerTitle: '카테고리 설정',
        }}
      />
    </Stack.Navigator>
  );
}

export default SettingStackNavigator;
