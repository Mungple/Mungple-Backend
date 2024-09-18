import React, {useRef, useEffect, useState} from 'react';
import {Animated, StyleSheet, Image} from 'react-native';
import MapView, {
  Heatmap,
  Marker,
  Polygon,
  Polyline,
  PROVIDER_GOOGLE,
} from 'react-native-maps';

import geohash from 'ngeohash';
import cluster from 'points-cluster';
import styled from 'styled-components/native';
import {useMapStore} from '@/state/useMapStore';

import MarkerForm from '../marker/MarkerForm';
import usePermission from '@/hooks/usePermission';
import useUserLocation from '@/hooks/useUserLocation';
import mungPleMarker from '@/assets/mungPleMarker.png';
import CustomMapButton from '../common/CustomMapButton';
import CustomBottomSheet from '../common/CustomBottomSheet';
import { colors } from '@/constants';

interface MapComponentProps {
  userLocation: {latitude: number; longitude: number};
  path?: {latitude: number; longitude: number}[];
  isFormVisible: boolean;
  onFormClose: () => void;
  onAddMarker: (markerData: Marker) => void;
  bottomOffset?: number;
}

interface Marker {
  id: string;
  latitude: number;
  longitude: number;
  title?: string;
  body?: string;
}

interface Cluster {
  latitude: number;
  longitude: number;
  count: number;
  cluster?: Marker[] | null | undefined;
}

interface Zone {
  latitude: number;
  longitude: number;
  weight?: number;
}

interface MungPlace {
  latitude: number;
  longitude: number;
}

const MapComponent: React.FC<MapComponentProps> = ({
  userLocation,
  isFormVisible,
  onFormClose,
  onAddMarker,
  bottomOffset = 0,
  path = [],
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
  const [clusteredMarkers, setClusteredMarkers] = useState<Cluster[]>([]);
  const [selectedCluster, setSelectedCluster] = useState<Marker[]>([]);
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
      setClusteredMarkers(
        clustered.map(c => ({
          ...c,
          cluster: c.cluster || null,
        }))
      );
    }
  }, [markers]);

  const clusterMarkers = (markers: Marker[]): Cluster[] => {
    return cluster(
      markers.map(marker => ({
        id: marker.id,
        latitude: marker.latitude,
        longitude: marker.longitude,
      })),
      {radius: 100},
    ).map((clusteredPoint: any) => ({
      latitude: clusteredPoint.latitude,
      longitude: clusteredPoint.longitude,
      count: clusteredPoint.count,
      cluster: clusteredPoint.cluster || null,
    }));
  };

  const handleClusterPress = (cluster: Cluster) => {
    if (cluster.cluster) {
      setSelectedCluster(
        cluster.cluster.map((c: Marker) => ({
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
    handlePressMenu()
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

        {/* path가 있을 때만 Polyline으로 표시 */}
        {path.length > 1 && (
          <Polyline
            coordinates={path}
            strokeColor={colors.ORANGE.LIGHTER} // Change color if needed
            strokeWidth={5}
          />
        )}

        {/* Clustered Markers */}
        {showUserMarkers &&
          clusteredMarkers.map((cluster: Cluster) => (
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
            iconName="settings-outline"
            inValid={isDisabled}
          />
        </ButtonWithTextContainer>
        <CustomBottomSheet
          modalVisible={modalVisible}
          setModalVisible={setModalVisible}
          menuName='지도 설정'
          height={500}
        >
          <CustomMapButton iconName='star' />
        </CustomBottomSheet>
      </Animated.View>

      <CustomMapButton
        onPress={handlePressUserLocation}
        iconName="locate"
        bottom={20 + bottomOffset}
        left={20}
      />
      <CustomMapButton
        onPress={() => {}}
        iconName="reload"
        bottom={20 + bottomOffset}
        right={20}
      />
    </Container>
  );
};

const createHeatmapPoints = (zones: Zone[]): {latitude: number; longitude: number; weight: number}[] => {
  return zones.map(zone => ({
    latitude: zone.latitude,
    longitude: zone.longitude,
    weight: zone.weight || 1,
  }));
};

const renderMungPlaces = (mungPlaces: MungPlace[]): JSX.Element[] => {
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
