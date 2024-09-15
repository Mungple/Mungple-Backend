import React from 'react';
import {useAppStore} from '@/state/useAppStore';
import {NavigationContainer} from '@react-navigation/native';

import AuthStackNavigator from '../stack/AuthStackNavigator';
import MapStackNavigator from '../stack/MapStackNavigator';

const RootNavigator: React.FC = () => {
  let navigatorToShow: JSX.Element;
  const isLogin = useAppStore((state) => state.isLogin);

  if (isLogin) {
    navigatorToShow = <MapStackNavigator />;
  } else {
    navigatorToShow = <AuthStackNavigator />;
  }

  return (
    <NavigationContainer>
      {navigatorToShow}
    </NavigationContainer>
  );
};

export default RootNavigator;
