// screens/MapScreen.tsx
import React, { useState } from 'react';
import styled from 'styled-components/native';

import { useUserStore } from '@/state/useUserStore';
import MapComponent from '@/components/map/MapComponent';
import useWebSocketActions from '@/hooks/useWebsocketActions';

const MapScreen = () => {
  const userLocation = useUserStore((state) => state.userLocation);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const { checkAllUserZone, checkMyBlueZone, checkMungPlace } = useWebSocketActions();

  const handleFormClose = () => {
    setIsFormVisible(false);
  };

  return (
    <Container>
      <MapComponent
        userLocation={userLocation}
        isFormVisible={isFormVisible}
        onFormClose={handleFormClose}
        checkMyBlueZone={checkMyBlueZone}
        checkAllUserZone={checkAllUserZone}
        checkMungPlace={checkMungPlace}
      />
    </Container>
  );
};

const Container = styled.SafeAreaView`
  flex: 1;
`;

export default MapScreen;
