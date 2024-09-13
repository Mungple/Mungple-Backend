import React, {useState} from 'react';
import {Dimensions} from 'react-native';

import {mapNavigations} from '@/constants';
import styled from 'styled-components/native';
import { useAppStore } from '@/state/useAppStore';
import useUserLocation from '@/hooks/useUserLocation';
import {useNavigation} from '@react-navigation/native';
import CustomCard from '@/components/common/CustomCard';
import MapComponent from '@/components/Map/MapComponent';
import CustomButton from '@/components/common/CustomButton';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {MapStackParamList} from '@/navigations/stack/MapStackNavigator';

const bottomBlockHeight = (Dimensions.get('window').height * 1) / 5;

const WalkingScreen = () => {
  const {userLocation} = useUserLocation();
  const [isFormVisible, setIsFormVisible] = useState(false);
  const setWalkingStart = useAppStore(state => state.setWalkingStart);

  const navigation = useNavigation<NativeStackNavigationProp<MapStackParamList>>();

  const handleWalkingEnd = () => {
    setWalkingStart(false);
    navigation.navigate(mapNavigations.HOME);
  };

  const handleFormClose = () => {
    setIsFormVisible(false);
  };

  const handleAddMarker = (markerData: any) => {
    console.log('Adding Marker:', markerData);
  };


  return (
    <Container>
      {userLocation && (
        <>
          <MapComponent
            userLocation={userLocation}
            isFormVisible={isFormVisible}
            onFormClose={handleFormClose}
            onAddMarker={handleAddMarker}
            bottomOffset={bottomBlockHeight + 20}
          />
          <BottomCard height={bottomBlockHeight}>
            <CustomButton label="산책 종료하기" onPress={handleWalkingEnd} />
          </BottomCard>
        </>
      )}
    </Container>
  );
};

const Container = styled.View`
  flex: 1;
`;

const BottomCard = styled(CustomCard)<{ height: number }>`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: ${({ height }) => `${height}px`};
`;

export default WalkingScreen;
