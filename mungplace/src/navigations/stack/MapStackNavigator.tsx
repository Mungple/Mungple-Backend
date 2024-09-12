import React from 'react';
import {mapNavigations} from '@/constants';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import HomeScreen from '@/screens/home/HomeScreen';
import WalkingScreen from '@/screens/walking/WalkingScreen';

export type MapStackParamList = {
  [mapNavigations.WALKING]: undefined;
  [mapNavigations.HOME]: undefined;
};

const Stack = createNativeStackNavigator<MapStackParamList>();

const MapStackNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerTitle: ' ',
        headerShown: false,
      }}>
      <Stack.Screen name={mapNavigations.WALKING} component={WalkingScreen}/>
      <Stack.Screen name={mapNavigations.HOME} component={HomeScreen}/>
    </Stack.Navigator>
  );
};

export default MapStackNavigator;
