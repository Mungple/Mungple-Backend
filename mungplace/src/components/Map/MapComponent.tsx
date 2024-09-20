import React, {useRef, useEffect, useState} from 'react';
import {Animated, StyleSheet, Image, Modal, View, Text, FlatList, Button } from 'react-native';
import MapView, {
  Heatmap,
  Marker,
  Polygon,
  Polyline,
  PROVIDER_GOOGLE,
} from 'react-native-maps';
import ClusteredMapView, { Cluster } from 'react-native-map-clustering'
import geohash from 'ngeohash';
import styled from 'styled-components/native';
import { useMapStore, Zone, MarkerData} from '@/state/useMapStore'; // zustand
import MarkerForm from '../marker/MarkerForm';
import usePermission from '@/hooks/usePermission';
import useUserLocation from '@/hooks/useUserLocation';
import mungPleMarker from '@/assets/mungPleMarker.png';
import CustomMapButton from '../common/CustomMapButton';
import CustomBottomSheet from '../common/CustomBottomSheet';
import { colors } from '@/constants';
import blueMarker from '@/assets/blueMarker.png'
import redMarker from '@/assets/redMarker.png'

interface MapComponentProps {
  userLocation: {latitude: number; longitude: number};
  path?: {latitude: number; longitude: number}[];
  bottomOffset?: number;
}

interface MungPlace {
  latitude: number;
  longitude: number;
}

const MapComponent: React.FC<MapComponentProps> = ({
  userLocation,
  bottomOffset = 0,
  path = [],
}) => {
  const {
    showPersonalBlueZone,
    showGlobalBlueZone,
    showRedZone,
    showMungPlace,
    personalBlueZones,
    globalBlueZones,
    redZones,
    mungPlaces,
    markers,
    addMarker,
    fetchPersonalBlueZone,
    fetchGlobalBlueZone,
    fetchRedZone,
    fetchMungPlace,
  } = useMapStore();

  const mapRef = useRef<MapView | null>(null);
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const [isFormVisible, setFormVisible] = useState(false);
  const translateY = useRef(new Animated.Value(0)).current;
  const [modalVisible, setModalVisible] = useState(false);
  const opacity = useRef(new Animated.Value(0)).current;
  const [isDisabled, setIsDisabled] = useState(true);
  const {isUserLocationError} = useUserLocation();
  const [ clusterMarkers, setClusterMarkers ] = useState<MarkerData[]>([]) // 클러스터에 포함된 마커
  const [ isListVisible, setListVisible ] = useState(false) // 마커 리스트 모달 표시 여부
  const [ selectedMarker, setSelectedMarker ] = useState<MarkerData | null>(null) // 리스트에서 선택된 마커
  const [ isModalVisible, setIsModalVisible ] = useState(false) // 마커 상세 정보 모달 표시 여부

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
  // 마커 추가 버튼 클릭 시 호출되는 함수
  const handleAddMarker = (markerData: MarkerData) => {
    addMarker(markerData)
  }
  // 유저의 위치를 호출하는 함수
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

  // 클러스터 클릭 시 호출되는 함수
  const handleClusterPress = (cluster: Cluster, markers: MarkerData[]) => {
    console.log('클러스터 정보:', cluster)
    console.log('마커 정보:', markers)
    
    const clusterMarker = markers.map(marker => ({
      id : marker.properties.index.toString(),
      title : marker.properties.title,
      description : marker.properties.description
    }))
    setClusterMarkers(clusterMarker)
    setListVisible(true) // 리스트 모달 호출
  }

  // 마커 클릭 시 상세 정보 모달 호출
  const handleMarkerPress = (marker: MarkerData) => {
    setSelectedMarker(marker)
    setIsModalVisible(true)
  }

  // 메뉴 햄버거 바 클릭 시 호출되는 함수
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
      <ClusteredMapView
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
        maxZoomLevel={20}
        style={{flex : 1}}
        clusteringEnabled={true}
        clusterColor={colors.ORANGE.DARKER}
        onClusterPress={handleClusterPress}
        >

        {/* path가 있을 때만 Polyline으로 표시 */}
        {path.length > 1 && (
          <Polyline
            coordinates={path}
            strokeColor={colors.ORANGE.LIGHTER} // Change color if needed
            strokeWidth={5}
          />
        )}

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

        {markers.map(marker => (
          <Marker
            key={marker.id}
            coordinate={{ latitude: marker.latitude, longitude: marker.longitude }}
            title={marker.title}
            description={marker.body}
            onPress={() => handleMarkerPress(marker)}
          >
            <Image source={marker.type === 'blue' ? blueMarker : redMarker } style={styles.markerImage} />
          </Marker>
        ))}
      </ClusteredMapView>

      {/* 마커 폼 호출 */}
      {isFormVisible && userLocation && (
        <MarkerForm
          isVisible={true}
          onSubmit={markerData => {
            handleAddMarker(markerData)
            setFormVisible(false)
          }}
          onClose={() => setFormVisible(false)}
          latitude={userLocation.latitude}
          longitude={userLocation.longitude}
        />
      )}

      {/* 클러스터에 포함된 마커 리스트 모달 */}
        <Modal visible={isListVisible} animationType="slide" onRequestClose={() => setListVisible(false)}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Clustered Markers</Text>
            <FlatList
              data={clusterMarkers}
              keyExtractor={item => item.id}
              renderItem={({item}) => (
                <View style={styles.listItem}>
                  <Text>{item.title}</Text>
                  <Button title="Details" onPress={() => handleMarkerPress(item)} />
                </View>
              )}
            />
            <Button title="Close" onPress={() => setListVisible(false)} />
          </View>
        </Modal>

        {/* 마커 상세 정보 모달 */}
        {selectedMarker && (
          <Modal visible={isModalVisible} animationType="slide" onRequestClose={() => setModalVisible(false)}>
            <View style={styles.modalContainer}>
              <Text style={styles.modalTitle}>{selectedMarker.title}</Text>
              <Text>{selectedMarker.body}</Text>
              {selectedMarker.imageUri && (
                <Image source={{uri: selectedMarker.imageUri}} style={styles.markerImageLarge} />
              )}
              <Button title="Close" onPress={() => setModalVisible(false)} />
            </View>
          </Modal>
        )}

      {/* 커스텀 맵 버튼 */}
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
            onPress={() => setFormVisible(true)}
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
  markerImageLarge: {
    width: 100,
    height: 100,
    resizeMode: 'contain',
  },
  modalContainer: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0,5)'
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  listItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
});

const Container = styled.View`
  flex: 1;
`;

// const StyledMapView = styled(MapView)`
//   flex: 1;
// `;

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

export default MapComponent;