// screens/MapScreen.tsx
import React, { useState } from 'react';
import styled from 'styled-components/native';

import { useUserStore } from '@/state/useUserStore';
import MapComponent from '@/components/map/MapComponent';
import useWebSocket from '@/hooks/useWebsocket';

const MapScreen = () => {
  const userLocation = useUserStore((state) => state.userLocation);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const {
    myBlueZone,
    allBlueZone,
    allRedZone,
    mungZone,
    checkAllUserZone,
    checkMyBlueZone,
    checkMungPlace,
  } = useWebSocket();

  const handleFormClose = () => {
    setIsFormVisible(false);
  };

  return (
    <Container>
      <MapComponent
        userLocation={userLocation}
        isFormVisible={isFormVisible}
        onFormClose={handleFormClose}
        myBlueZone={myBlueZone}
        allBlueZone={allBlueZone}
        allRedZone={allRedZone}
        mungZone={mungZone}
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
