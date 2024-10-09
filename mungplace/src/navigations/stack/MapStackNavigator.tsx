import React from 'react';
import { mapNavigations } from '@/constants';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MainTabNavigator from '../tab/MainTabNavigator';
import WalkingScreen from '@/screens/walking/WalkingScreen';
import MarkerDetailScreen from '@/screens/map/MarkerDetailScreen';
import MyMarkerScreen from '@/screens/map/MyMarkerScreen';
import FacilityDetailScreen from '@/screens/map/FacilityDetailScreen';
import Countdown from '@/screens/walking/CountDown';

export type MapStackParamList = {
  [mapNavigations.HOME]: undefined;
  [mapNavigations.WALKING]: undefined;
  [mapNavigations.MARKERDETAIL]: { markerId: string };
  [mapNavigations.MYMARKERLIST]: undefined;
  [mapNavigations.FACILITYDETAIL]: { facilityId: number };
  [mapNavigations.COUNTDOWN]: undefined;
};

const HomeStack = createNativeStackNavigator<MapStackParamList>();

const MapStackNavigator: React.FC = () => {
  return (
    <HomeStack.Navigator screenOptions={{ headerShown: false }}>
      <HomeStack.Screen name={mapNavigations.HOME} component={MainTabNavigator} />
      <HomeStack.Screen name={mapNavigations.WALKING} component={WalkingScreen} />
      <HomeStack.Screen name={mapNavigations.COUNTDOWN} component={Countdown} />
      <HomeStack.Screen
        name={mapNavigations.MARKERDETAIL}
        component={MarkerDetailScreen}
        options={{
          headerShown: true,
          headerTitle: '마커 정보',
          headerTitleStyle: { fontFamily: 'OTLaundryGothicB', fontSize: 24 },
        }}
      />
      <HomeStack.Screen
        name={mapNavigations.MYMARKERLIST}
        component={MyMarkerScreen}
        options={{
          headerShown: true,
          headerTitle: '내 마커 목록',
          headerTitleStyle: { fontFamily: 'OTLaundryGothicB', fontSize: 24 },
        }}
      />
      <HomeStack.Screen
        name={mapNavigations.FACILITYDETAIL}
        component={FacilityDetailScreen}
        options={{
          headerShown: true,
          headerTitle: '편의정보',
          headerTitleStyle: { fontFamily: 'OTLaundryGothicB', fontSize: 24 },
        }}
      />
    </HomeStack.Navigator>
  );
};

export default MapStackNavigator;
