import React, {useRef, useState} from 'react';
import {Animated} from 'react-native';

import styled from 'styled-components/native';
import {useMapStore} from '@/state/useMapStore';
import usePermission from '@/hooks/usePermission';
import useUserLocation from '@/hooks/useUserLocation';
import CustomMapButton from '@/components/common/CustomMapButton';
import MapView, {Heatmap, Marker, PROVIDER_GOOGLE} from 'react-native-maps';

const WalkingScreen: React.FC = () => {
  const {
    showPersonalBlueZone,
    showGlobalBlueZone,
    showRedZone,
    showMungPlace,
    personalBlueZones,
    globalBlueZones,
    redZones,
    mungPlaces,
  } = useMapStore();

  const mapRef = useRef<MapView | null>(null);
  const {userLocation, isUserLocationError} = useUserLocation();
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const [isDisabled, setIsDisabled] = useState(true);
  const translateY = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  const handlePressUserLocation = () => {
    if (isUserLocationError) {
      return;
    }

    mapRef.current?.animateToRegion({
      latitude: userLocation?.latitude || 35.096406,
      longitude: userLocation?.longitude || 128.853919,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421,
    });
  };

  const handlePressMenu = () => {
    setIsMenuVisible(prev => !prev);
    if (isMenuVisible) {
      Animated.parallel([
        Animated.timing(translateY, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start(() => setIsDisabled(true));
    } else {
      Animated.parallel([
        Animated.timing(translateY, {
          toValue: 80,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start(() => setIsDisabled(false));
    }
  };

  const handlePressRefresh = () => {};
  const handlePressMarker = () => {};
  const handlePressSetting = () => {};

  usePermission('LOCATION');

  return (
    <Container>
      <StyledMapView
        ref={mapRef}
        provider={PROVIDER_GOOGLE}
        showsUserLocation
        followsUserLocation
        showsMyLocationButton={false}
      >
        {/* 개인 블루존 히트맵 */}
        {/* {showPersonalBlueZone && (
          <Heatmap
            points={personalBlueZones.map(zone => ({
              latitude: zone.latitude,
              longitude: zone.longitude,
              weight: zone.weight || 1,
            }))} 
          />
        )} */}

        {/* 전체 블루존 히트맵 */}
        {/* {showGlobalBlueZone && (
          <Heatmap
            points={globalBlueZones.map(zone => ({
              latitude: zone.latitude,
              longitude: zone.longitude,
              weight: zone.weight || 1,
            }))} 
          />
        )} */}

        {/* 레드존 */}
        {/* {showRedZone && redZones.map((zone, index) => (
          <Marker
            key={index}
            coordinate={{
              latitude: zone.latitude,
              longitude: zone.longitude,
            }}
            title="Red Zone"
          />
        ))} */}

        {/* 멍플레이스 */}
        {showMungPlace && mungPlaces.map((place, index) => (
          <Marker
            key={index}
            coordinate={{
              latitude: place.latitude,
              longitude: place.longitude,
            }}
            title="Mung Place"
          />
        ))}
      </StyledMapView>

      {/* 햄버거 버튼 */}
      <CustomMapButton
        onPress={handlePressMenu}
        iconName={'menu'}
        top={20}
        right={20}
      />

      {/* 마커 버튼 및 텍스트, 설정 버튼 및 텍스트 */}
      <Animated.View style={{ transform: [{translateY}], opacity, position:'absolute', top: 0, right: 0}}>
        <ButtonWithTextContainer top={40} right={20}>
          <TextLabel>마커 등록</TextLabel>
          <CustomMapButton
            onPress={handlePressMarker}
            iconName={'flag'}
            inValid={isDisabled}
          />
        </ButtonWithTextContainer>

        <ButtonWithTextContainer top={120} right={20}>
          <TextLabel>지도 설정</TextLabel>
          <CustomMapButton
            onPress={handlePressSetting}
            iconName={'settings'}
            inValid={isDisabled}
          />
        </ButtonWithTextContainer>
      </Animated.View>

      {/* 위치 버튼 */}
      <CustomMapButton
        onPress={handlePressUserLocation}
        iconName={'locate'}
        bottom={20}
        left={20}
      />

      {/* 새로고침 버튼 */}
      <CustomMapButton
        onPress={handlePressRefresh}
        iconName={'refresh'}
        bottom={20}
        right={20}
      />
    </Container>
  );
};

const Container = styled.View`
  flex: 1;
`;

const StyledMapView = styled(MapView)`
  flex: 1;
`;

const ButtonWithTextContainer = styled.View<{top?: number; right?: number}>`
  position: absolute;
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;
  top: ${({top}) => top || 0}px;
  right: ${({right}) => right || 0}px;
`;

const TextLabel = styled.Text`
  margin-right: 80px;
  font-size: 24px;
  font-weight: bold;
  color: black;
`;

export default WalkingScreen;
