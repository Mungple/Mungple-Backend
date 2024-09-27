import React from 'react';
import {mapNavigations} from '@/constants';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import MainTabNavigator from '../tab/MainTabNavigator';
import WalkingScreen from '@/screens/walking/WalkingScreen';
import MarkerDetailScreen from '@/screens/map/MarkerDetailScreen';

export type MapStackParamList = {
  [mapNavigations.HOME]: undefined;
  [mapNavigations.WALKING]: undefined;
  [mapNavigations.MARKERDETAIL]: undefined;
};

const HomeStack = createNativeStackNavigator<MapStackParamList>();

const MapStackNavigator: React.FC = () => {
  return (
    <HomeStack.Navigator screenOptions={{headerShown: false}}>
      <HomeStack.Screen name={mapNavigations.HOME} component={MainTabNavigator}/>
      <HomeStack.Screen name={mapNavigations.WALKING} component={WalkingScreen}/>
      <HomeStack.Screen name={mapNavigations.MARKERDETAIL} component={MarkerDetailScreen}/>
    </HomeStack.Navigator>
  );
};

export default MapStackNavigator;
