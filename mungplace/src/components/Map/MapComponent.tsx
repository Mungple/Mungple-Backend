import React, {useRef, useEffect, useState} from 'react';
import {Animated, StyleSheet, Image } from 'react-native';
import MapView, {
  Marker,
  Polyline,
  PROVIDER_GOOGLE,
} from 'react-native-maps';
import HeatmapLayer from './HeatmapLayer'; // 히트맵
import ClusteredMapView, { Cluster } from 'react-native-map-clustering'
import styled from 'styled-components/native';
import { useMapStore, MarkerData} from '@/state/useMapStore'; // zustand
import usePermission from '@/hooks/usePermission'; // 퍼미션
import useUserLocation from '@/hooks/useUserLocation'; // 유저 위치
import CustomMapButton from '../common/CustomMapButton'; // 커스텀 버튼
import CustomBottomSheet from '../common/CustomBottomSheet'; // 커스텀 바텀 바
import { colors } from '@/constants'; // 색깔
import blueMarker from '@/assets/blueMarker.png' // 블루 마커
import redMarker from '@/assets/redMarker.png' // 레드 마커
import PolygonLayer from './PolygonLayer'; // 멍플 지오해시
import MarkerManager from '../marker/MarkerManager'; // 마커 관리
import ClusterMarkerList from '../marker/ClusterMarkerList' // 클러스터 마커 리스트


interface MapComponentProps {
  userLocation: {latitude: number; longitude: number};
  path?: {latitude: number; longitude: number}[];
  bottomOffset?: number;
  markers : MarkerData[]
  isFormVisible: boolean;
}

const MapComponent: React.FC<MapComponentProps> = ({
  userLocation,
  bottomOffset = 0,
  path = [],
  // onFormClose,
  // onAddMarker,
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
    
    // const clusterMarker = markers.map(marker => ({
    //   id : marker.properties.index.toString(),
    //   title : marker.properties.title,
    //   description : marker.properties.description
    // }))
    setClusterMarkers(markers)
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

        {/* 히트맵 */}
        {showPersonalBlueZone && (
          <HeatmapLayer zones={personalBlueZones} />
        )}
        {showGlobalBlueZone && (
          <HeatmapLayer zones={globalBlueZones} />
        )}
        {showRedZone && (
          <HeatmapLayer
            zones={redZones}
            radius={50}
            opacity={0.6}
          />
        )}

        {/* 멍플 */}
        {showMungPlace && <PolygonLayer mungPlaces={mungPlaces} />}

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
      
      {/* 마커 매니저 */}
      <MarkerManager
        userLocation={userLocation}
        onAddMarker={addMarker}
        markers={markers}
        isFormVisible={isFormVisible}
        setFormVisible={setFormVisible}
      />

      {/* 클러스터 마커 리스트 */}
      <ClusterMarkerList
        isVisible={isListVisible}
        clusterMarkers={clusterMarkers}
        onMarkerPress={handleMarkerPress}
        onClose={() => setListVisible(false)}
      />

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
            onPress={() => { 
              console.log('모달 열기')
              setFormVisible(true)}}
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