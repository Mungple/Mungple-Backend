import React from 'react';
import {mapNavigations} from '@/constants';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import WalkingScreen from '@/screens/walking/WalkingScreen';
import MainTabNavigator from '../tap/MainTabNavigator';

export type MapStackParamList = {
  [mapNavigations.WALKING]: undefined;
  [mapNavigations.HOME]: undefined;
};

const HomeStack = createNativeStackNavigator<MapStackParamList>();

const MapStackNavigator: React.FC = () => {
  return (
    <HomeStack.Navigator screenOptions={{headerShown: false}}>
      <HomeStack.Screen name={mapNavigations.HOME} component={MainTabNavigator}/>
      <HomeStack.Screen name={mapNavigations.WALKING} component={WalkingScreen}/>
    </HomeStack.Navigator>
  );
};

export default MapStackNavigator;
