import React from 'react';
import { NavigatorScreenParams, RouteProp } from '@react-navigation/native';
import { colors, mainNavigations } from '@/constants';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import MapScreen from '@/screens/map/MapScreen';
import HomeScreen from '@/screens/home/HomeScreen';
import SettingStackNavigator, { SettingStackParamList } from '../stack/SettingStackNavigator';
import RecordStackNavigator from '../stack/RecordStackNavigator';

type MainTabParamList = {
  [mainNavigations.HOME]: undefined;
  [mainNavigations.MAP]: undefined;
  [mainNavigations.RECORD]: undefined;
  [mainNavigations.MYPAGE]: NavigatorScreenParams<SettingStackParamList>;
};

const Tab = createBottomTabNavigator<MainTabParamList>();

function TabBarIcons(route: RouteProp<MainTabParamList>, focused: boolean) {
  let iconName = '';

  switch (route.name) {
    case mainNavigations.HOME: {
      iconName = focused ? 'home' : 'home-outline';
      break;
    }
    case mainNavigations.MAP: {
      iconName = focused ? 'map' : 'map-outline';
      break;
    }
    case mainNavigations.RECORD: {
      iconName = focused ? 'document-text' : 'document-text-outline';
      break;
    }
    case mainNavigations.MYPAGE: {
      iconName = focused ? 'person' : 'person-outline';
      break;
    }
  }

  return <Ionicons name={iconName} color={focused ? colors.ORANGE.BASE : colors.BLACK} size={30} />;
}

const MainTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarActiveTintColor: `${colors.ORANGE.BASE}`,
        tabBarInactiveTintColor: `${colors.BLACK}`,
        headerStyle: {
          backgroundColor: colors.WHITE,
          shadowColor: colors.GRAY_200,
        },
        tabBarStyle: {
          height: 80,
          paddingTop: 10,
          paddingBottom: 10,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: 'bold',
        },
        headerShown: false,
        tabBarIcon: ({ focused }) => TabBarIcons(route, focused),
      })}>
      <Tab.Screen name={mainNavigations.HOME} component={HomeScreen} options={{ title: '홈' }} />
      <Tab.Screen name={mainNavigations.MAP} component={MapScreen} options={{ title: '지도' }} />
      <Tab.Screen
        name={mainNavigations.RECORD}
        component={RecordStackNavigator}
        options={{ title: '기록' }}
      />
      <Tab.Screen
        name={mainNavigations.MYPAGE}
        component={SettingStackNavigator}
        options={{ title: '내정보' }}
      />
    </Tab.Navigator>
  );
};

export default MainTabNavigator;
