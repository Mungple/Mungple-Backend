import React, {useState} from 'react';
import {Dimensions, Text} from 'react-native';
import styled from 'styled-components/native';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';

import {mapNavigations} from '@/constants';
import {useAppStore} from '@/state/useAppStore';
import useUserLocation from '@/hooks/useUserLocation';
import {MapStackParamList} from '@/navigations/stack/MapStackNavigator';

import CustomCard from '@/components/common/CustomCard';
import MapComponent from '@/components/map/MapComponent';
import ElapsedTime from '@/components/walking/ElapsedTime';
import CustomButton from '@/components/common/CustomButton';

const bottomBlockHeight = (Dimensions.get('window').height * 1) / 5;
const bottomBlockWidth = Dimensions.get('window').width - 40;

const WalkingScreen = () => {
  const {userLocation} = useUserLocation();
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [distance, setDistance] = useState(0);
  const setWalkingStart = useAppStore(state => state.setWalkingStart);

  const navigation =
    useNavigation<NativeStackNavigationProp<MapStackParamList>>();

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
          <BottomCard height={bottomBlockHeight} width={bottomBlockWidth}>
            <WalkingInfo>
              <InfoRow>
                <InfoBlock>
                  <InfoLabel>소요 시간</InfoLabel>
                  <ElapsedTime />
                </InfoBlock>
                <InfoBlock>
                  <InfoLabel>이동 거리</InfoLabel>
                  <InfoValue>{distance.toFixed(1)} km</InfoValue>
                </InfoBlock>
              </InfoRow>
            </WalkingInfo>
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

const BottomCard = styled(CustomCard)<{height: number, width: number}>`
  position: absolute;
  bottom: 0;
  height: ${({height}) => `${height}px`};
  width: ${({width}) => `${width}px`};
  margin-right: 20px;
  padding: 20px;
`;

const WalkingInfo = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  margin-bottom: 10px;
`;

const InfoRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
  width: 100%;
`;

const InfoBlock = styled.View`
  flex: 1;
  align-items: center;
`;

const InfoLabel = styled(Text)`
  font-size: 18px;
  color: #999999;
`;

const InfoValue = styled(Text)`
  font-size: 32px;
  font-weight: bold;
  color: #000000;
`;

export default WalkingScreen;
