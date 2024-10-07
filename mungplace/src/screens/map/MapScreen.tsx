// screens/MapScreen.tsx
import React, { useState } from 'react';
import styled from 'styled-components/native';

import MapComponent from '@/components/map/MapComponent';
import useWebSocketActions from '@/hooks/useWebsocketActions';

const MapScreen = () => {
  const [isFormVisible, setIsFormVisible] = useState(false);
  const { checkAllUserZone, checkMyBlueZone, checkMungPlace } = useWebSocketActions();

  const handleFormClose = () => {
    setIsFormVisible(false);
  };

  return (
    <Container>
      <MapComponent
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
