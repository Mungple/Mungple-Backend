import React from 'react';
import {mainNavigations} from '@/constants';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';

import MapScreen from '@/screens/map/MapScreen';
import HomeScreen from '@/screens/home/HomeScreen';
import MyPageScreen from '@/screens/user/MyPageScreen';
import RecordScreen from '@/screens/record/RecordScreen';
import RankingScreen from '@/screens/ranking/RankingScreen';

type MainTabParamList = {
  [mainNavigations.HOME]: undefined;
  [mainNavigations.MAP]: undefined;
  [mainNavigations.RECORD]: undefined;
  [mainNavigations.RANKING]: undefined;
  [mainNavigations.MYPAGE]: undefined;
};

const Tab = createBottomTabNavigator<MainTabParamList>();

const MainTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarLabelStyle: {
          fontSize: 18,
        },
        headerShown: false,
      }}>
      <Tab.Screen
        name={mainNavigations.HOME}
        component={HomeScreen}
        options={{
          title: '홈',
        }}
      />
      <Tab.Screen
        name={mainNavigations.MAP}
        component={MapScreen}
        options={{
          title: '지도',
        }}
      />
      <Tab.Screen
        name={mainNavigations.RECORD}
        component={RecordScreen}
        options={{
          title: '기록',
        }}
      />
      <Tab.Screen
        name={mainNavigations.RANKING}
        component={RankingScreen}
        options={{
          title: '랭킹',
        }}
      />
      <Tab.Screen
        name={mainNavigations.MYPAGE}
        component={MyPageScreen}
        options={{
          title: '내정보',
        }}
      />
    </Tab.Navigator>
  );
}

export default MainTabNavigator
