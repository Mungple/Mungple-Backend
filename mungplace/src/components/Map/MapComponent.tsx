import React, {useRef, useEffect, useState} from 'react';
import {Animated, StyleSheet, Image} from 'react-native';
import MapView, {
  Heatmap,
  Marker,
  Polygon,
  PROVIDER_GOOGLE,
} from 'react-native-maps';

import geohash from 'ngeohash';
import cluster from 'points-cluster';
import styled from 'styled-components/native';
import {useMapStore} from '@/state/useMapStore';

import BottomSheet from '../common/BottomSheet';
import MarkerForm from '../marker/MarkerForm';
import usePermission from '@/hooks/usePermission';
import useUserLocation from '@/hooks/useUserLocation';
import mungPleMarker from '@/assets/mungPleMarker.png';
import CustomMapButton from '../common/CustomMapButton';

interface MapComponentProps {
  userLocation: {latitude: number; longitude: number};
  isFormVisible: boolean;
  onFormClose: () => void;
  onAddMarker: (markerData: any) => void;
  bottomOffset?: number;
}

const MapComponent: React.FC<MapComponentProps> = ({
  userLocation,
  isFormVisible,
  onFormClose,
  onAddMarker,
  bottomOffset = 0,
}) => {
  const {
    showPersonalBlueZone,
    showGlobalBlueZone,
    showRedZone,
    showMungPlace,
    showUserMarkers,
    personalBlueZones,
    globalBlueZones,
    redZones,
    mungPlaces,
    markers,
    fetchPersonalBlueZone,
    fetchGlobalBlueZone,
    fetchRedZone,
    fetchMungPlace,
  } = useMapStore();

  const mapRef = useRef<MapView | null>(null);
  const [clusteredMarkers, setClusteredMarkers] = useState<any[]>([]);
  const [selectedCluster, setSelectedCluster] = useState<any[]>([]);
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const translateY = useRef(new Animated.Value(0)).current;
  const [modalVisible, setModalVisible] = useState(false);
  const opacity = useRef(new Animated.Value(0)).current;
  const [isDisabled, setIsDisabled] = useState(true);
  const {isUserLocationError} = useUserLocation();

  // Fetch zones data
  useEffect(() => {
    fetchAllZones(userLocation);
  }, [userLocation]);

  const fetchAllZones = (location: {latitude: number; longitude: number}) => {
    fetchPersonalBlueZone(location.latitude, location.longitude);
    fetchGlobalBlueZone(location.latitude, location.longitude);
    fetchRedZone(location.latitude, location.longitude);
    fetchMungPlace(location.latitude, location.longitude);
  };

  // Cluster markers
  useEffect(() => {
    if (markers.length > 0) {
      const clustered = clusterMarkers(markers);
      setClusteredMarkers(clustered);
    }
  }, [markers]);

  const clusterMarkers = (markers: any[]) => {
    return cluster(
      markers.map(marker => ({
        latitude: marker.latitude,
        longitude: marker.longitude,
        id: marker.id,
      })),
      {radius: 100},
    );
  };

  const handleClusterPress = (cluster: any) => {
    if (cluster.cluster) {
      setSelectedCluster(
        cluster.cluster.map((c: any) => ({
          id: c.id,
          latitude: c.latitude,
          longitude: c.longitude,
          title: c.title,
          body: c.body,
        })),
      );
    }
  };

  const handlePressUserLocation = () => {
    if (!isUserLocationError) {
      mapRef.current?.animateToRegion({
        latitude: userLocation.latitude || 35.096406,
        longitude: userLocation.longitude || 128.853919,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      });
    }
  };

  const handlePressMenu = () => {
    setIsMenuVisible(prev => !prev);
    const animationTargets = isMenuVisible
      ? {translateY: 0, opacity: 0}
      : {translateY: 80, opacity: 1};

    Animated.parallel([
      Animated.timing(translateY, {
        toValue: animationTargets.translateY,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: animationTargets.opacity,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => setIsDisabled(isMenuVisible));
  };

  const handlePressSetting = () => {
    setModalVisible(true);
  }

  usePermission('LOCATION');

  return (
    <Container>
      <StyledMapView
        ref={mapRef}
        provider={PROVIDER_GOOGLE}
        showsUserLocation
        followsUserLocation
        showsMyLocationButton={false}
        initialRegion={{
          latitude: userLocation.latitude || 35.096406,
          longitude: userLocation.longitude || 128.853919,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
        minZoomLevel={15}
        maxZoomLevel={20}>
        {/* Clustered Markers */}
        {showUserMarkers &&
          clusteredMarkers.map((cluster: any) => (
            <Marker
              key={`cluster-${cluster.latitude}-${cluster.longitude}`}
              coordinate={{
                latitude: cluster.latitude,
                longitude: cluster.longitude,
              }}
              onPress={() => handleClusterPress(cluster)}>
              {cluster.cluster ? (
                <ClusterContainer>
                  <ClusterText>{cluster.count}</ClusterText>
                </ClusterContainer>
              ) : (
                <Image source={mungPleMarker} style={styles.markerImage} />
              )}
            </Marker>
          ))}

        {/* Heatmaps */}
        {showPersonalBlueZone && (
          <Heatmap points={createHeatmapPoints(personalBlueZones)} />
        )}
        {showGlobalBlueZone && (
          <Heatmap points={createHeatmapPoints(globalBlueZones)} />
        )}
        {showRedZone && (
          <Heatmap
            points={createHeatmapPoints(redZones)}
            radius={50}
            opacity={0.6}
          />
        )}

        {/* Mung Places */}
        {showMungPlace && renderMungPlaces(mungPlaces)}
      </StyledMapView>

      {/* Marker Form */}
      {isFormVisible && userLocation && (
        <MarkerForm
          onSubmit={markerData => {
            onAddMarker(markerData);
            onFormClose();
          }}
          onClose={onFormClose}
          latitude={userLocation.latitude}
          longitude={userLocation.longitude}
        />
      )}

      {/* Custom Map Buttons */}
      <CustomMapButton
        onPress={handlePressMenu}
        iconName="menu"
        top={20}
        right={20}
      />

      <Animated.View
        style={{
          transform: [{translateY}],
          opacity,
          position: 'absolute',
          top: 0,
          right: 0,
        }}>
        <ButtonWithTextContainer top={40} right={20}>
          <TextLabel>마커 등록</TextLabel>
          <CustomMapButton
            onPress={() => {}}
            iconName="location-outline"
            inValid={isDisabled}
          />
        </ButtonWithTextContainer>

        <ButtonWithTextContainer top={120} right={20}>
          <TextLabel>지도 설정</TextLabel>
          <CustomMapButton
            onPress={handlePressSetting}
            iconName="settings"
            inValid={isDisabled}
          />
        </ButtonWithTextContainer>
        <BottomSheet
          modalVisible={modalVisible}
          setModalVisible={setModalVisible}
        >
          <CustomMapButton iconName='flag' />
        </BottomSheet>
      </Animated.View>

      <CustomMapButton
        onPress={handlePressUserLocation}
        iconName="locate"
        bottom={20 + bottomOffset}
        left={20}
      />
      <CustomMapButton
        onPress={() => {}}
        iconName="refresh"
        bottom={20 + bottomOffset}
        right={20}
      />
    </Container>
  );
};

const createHeatmapPoints = (zones: any[]) => {
  return zones.map(zone => ({
    latitude: zone.latitude,
    longitude: zone.longitude,
    weight: zone.weight || 1,
  }));
};

const renderMungPlaces = (mungPlaces: any[]) => {
  return mungPlaces.map(place => {
    const hash = geohash.encode(place.latitude, place.longitude, 6);
    const {latitude, longitude} = geohash.decode(hash);
    const delta = 0.001;
    const coordinates = [
      {latitude: latitude - delta, longitude: longitude - delta},
      {latitude: latitude - delta, longitude: longitude + delta},
      {latitude: latitude + delta, longitude: longitude + delta},
      {latitude: latitude + delta, longitude: longitude - delta},
    ];

    return (
      <React.Fragment key={`${place.latitude}-${place.longitude}`}>
        <Polygon
          coordinates={coordinates}
          fillColor="rgba(255, 255, 0, 0.3)"
          strokeColor="rgba(255, 255, 0, 0.7)"
        />
        <Marker coordinate={{latitude, longitude}}>
          <Image source={mungPleMarker} style={styles.markerImage} />
        </Marker>
      </React.Fragment>
    );
  });
};

const styles = StyleSheet.create({
  markerImage: {
    width: 30,
    height: 30,
  },
});

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

const ClusterContainer = styled.View`
  background-color: #ff6347;
  padding: 10px;
  border-radius: 20px;
  align-items: center;
  justify-content: center;
`;

const ClusterText = styled.Text`
  color: #fff;
  font-size: 14px;
`;

export default MapComponent;
