import React, {useRef, useEffect, useState} from 'react';
import {Animated, StyleSheet, Image, Text } from 'react-native';
import MapView, {
  Heatmap,
  Marker,
  Polyline,
  PROVIDER_GOOGLE,
} from 'react-native-maps';
import ClusteredMapView from 'react-native-map-clustering' // 클러스터링 라이브러리
import styled from 'styled-components/native';
import { useMapStore, MarkerData, NearbyMarkerData } from '@/state/useMapStore'; // zustand
import ClusterModal from '../marker/ClusterModal';
import usePermission from '@/hooks/usePermission'; // 퍼미션
import useUserLocation from '@/hooks/useUserLocation'; // 유저 위치
import CustomMapButton from '../common/CustomMapButton'; // 커스텀 버튼
import CustomBottomSheet from '../common/CustomBottomSheet'; // 커스텀 바텀 바
import { colors } from '@/constants'; // 색깔
import blueMarker from '@/assets/blueMarker.png' // 블루 마커
import redMarker from '@/assets/redMarker.png' // 레드 마커
import PolygonLayer from './PolygonLayer'; // 멍플 지오해시
import MarkerForm from '../marker/MarkerForm';
import { useNavigation } from '@react-navigation/native';
import { mapNavigations } from '@/constants';
import useMarkersWithinRadius from '@/hooks/useMarkersWithinRadius'; // 주변 위치 조회 훅
import useWebSocket from '@/hooks/useWebsocket' // 웹소켓에서 블루, 레드 멍플 가져올거임


interface MapComponentProps {
  userLocation: {latitude: number; longitude: number};
  path?: {latitude: number; longitude: number}[];
  bottomOffset?: number;
  markers : MarkerData[] // 마커 생성 용
  isFormVisible: boolean
  onFormClose: () => void
  
  // userMarkers : UserMarker[] // 유저 마커
  // nearbyMarkers : UserMarker[] // 주변 마커 데이터
}

const MapComponent: React.FC<MapComponentProps> = ({
  userLocation,
  bottomOffset = 0,
  path = [],
  onFormClose,
}) => {

  useMarkersWithinRadius()
  const {
    myBlueZone,
    allBlueZone,
    allRedZone,
    mungZone,
  } = useWebSocket();
  const { addMarker } = useMapStore();
  const nearbyMarkers = useMapStore((state) => state.nearbyMarkers) // 상태에서 nearbyMarkers 가져오기
  const navigation = useNavigation()
  const mapRef = useRef<MapView | null>(null);
  const [isClusterModalVisible, setClusterModalVisible] = useState(false);
  const [selectedClusterMarkers, setSelectedClusterMarkers] = useState<NearbyMarkerData[]>([]);
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const [formVisible, setFormVisible] = useState(false); // 마커폼 가시성 함수
  const translateY = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const [isDisabled, setIsDisabled] = useState(true);
  const {isUserLocationError} = useUserLocation();
  const [isSettingModalVisible, setIsSettingModalVisible] = useState(false) // 환경 설정에 쓰는 모달 가시성

  // 존 체크 용임 지울거임 나중에
  useEffect(() => {
    console.log('나의 블루존:', myBlueZone)
    console.log('블루존:', allBlueZone)
    console.log('레드존:', allRedZone)
    console.log('멍플:', mungZone)
  }, [myBlueZone, allBlueZone, allRedZone, mungZone]); 

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

  // 마커 등록 하기 => 오류 발생 시 여기 타입 일 수 있음
  const handleMarkerSubmit = (markerData: MarkerData) => {
    addMarker(markerData)
    setFormVisible(false)
  };

  // 마커 클릭 시 호출되는 함수 (상세정보 호출)
  const handleMarkerClick = (markerId: string) => {
    // 데이터 구조에서 모든 클러스터를 순회
    Object.keys(nearbyMarkers.markersGroupedByGeohash).forEach(geohash => {
      const cluster = nearbyMarkers.markersGroupedByGeohash[geohash];
      
      // 각 클러스터의 markers 배열을 순회
      const marker = cluster.markers.find(m => m.markerId === markerId);
      
      // 해당 markerId가 있는 경우 상세 페이지로 이동
      if (marker) {
        navigation.navigate(mapNavigations.MARKERDETAIL, { markerId });
        console.log(`마커 클릭 : ${markerId}`);
        setClusterModalVisible(false);
      }
    });
  };
  const handleClusterPress = (geohash: string) => {
    const clusterData = nearbyMarkers?.markersGroupedByGeohash[geohash]
    if (clusterData) {
      setSelectedClusterMarkers(clusterData.markers); // 선택한 클러스터 데이터 설정
      setClusterModalVisible(true); // 모달 열기
    };
  };
  
  // 클러스터 모달 닫기
  // const handleCloseClusterModal = () => {
  //   setIsClusterModalVisible(false)
  //   setClusterMarkers([]) // 클러스터 리스트 모달을 닫으면 클러스터 마커 목록 초기화
  // }

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

  // 환경설정(토글 모음)
  const handlePressSetting = () => {
    setIsSettingModalVisible(true);
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
        onClusterPress={(cluster) => handleClusterPress(cluster)}
        >
        {nearbyMarkers && nearbyMarkers.markersGroupedByGeohash ? (
          Object.keys(nearbyMarkers.markersGroupedByGeohash).map((key) => {
            const cluster = nearbyMarkers.markersGroupedByGeohash[key];
            const { markers, geohashCenter } = cluster; // 클러스터에서 마커 배열 및 geohashCenter 가져오기

            // 마커가 존재하는지 확인
            if (markers && markers.length > 0) {
              return markers.map((marker) => (
                <Marker
                  key={marker.markerId} // 각 마커에 고유 키 할당
                  coordinate={{
                    latitude: geohashCenter.lat, // geohashCenter에서 위도 가져오기
                    longitude: geohashCenter.lon, // geohashCenter에서 경도 가져오기
                  }}
                  onPress={() => handleMarkerClick(marker.markerId)}
                >
                  <Image
                    source={marker.type === 'BLUE' ? blueMarker : redMarker}
                    style={styles.markerImage}
                  />
                </Marker>
              ));
            } else {
              return <Text key={key}>마커가 없습니다.</Text>; // 클러스터 내 마커가 없을 때 표시
            }
          })
        ) : (
          <Text>근처 마커 데이터가 없습니다.</Text> // 데이터가 없을 때 표시
        )}
        {/* path가 있을 때만 Polyline으로 표시 */}
        {path.length > 1 && (
          <Polyline
            coordinates={path}
            strokeColor={colors.ORANGE.LIGHTER} // Change color if needed
            strokeWidth={5}
          />
        )}

        {/* 개인 블루존 히트맵 */}
        {myBlueZone && myBlueZone.cells.length > 0 && (
          <Heatmap
            points={myBlueZone.cells.map(cell => ({
              latitude: cell.point.latitude,
              longitude: cell.point.longitude,
              weight: cell.weight,
            }))}
          />
        )}
        {/* 전체 블루존 히트맵 */}
        {allBlueZone && allBlueZone.cells.length > 0 && (
          <Heatmap
            points={allBlueZone.cells.map(cell => ({
              latitude: cell.point.latitude,
              longitude: cell.point.longitude,
              weight: cell.weight,
            }))}
          />
        )}

        {/* 전체 레드존 히트맵 */}
        {allRedZone && allRedZone.cells.length > 0 && (
          <Heatmap
            points={allRedZone.cells.map(cell => ({
              latitude: cell.point.latitude,
              longitude: cell.point.longitude,
              weight: cell.weight,
            }))}
            gradient={{
              colors: ['red', 'darkred'], // 레드존 색상 설정
              startPoints: [0.2, 1.0],
              colorMapSize: 256,
            }}
          />
        )}

      </ClusteredMapView>

      <ClusterModal
        isVisible={isClusterModalVisible}
        markers={selectedClusterMarkers}   
        onClose={() => setClusterModalVisible(false)}
        fetchMarkerDetails={handleMarkerClick} // 마커 상세 정보 가져오기 함수 전달
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
            inValid={false}
          />
        </ButtonWithTextContainer>
        {/* MarkerForm 모달 */}
        <MarkerForm 
        isVisible={formVisible} 
        onSubmit={handleMarkerSubmit} 
        onClose={() => setFormVisible(false)} 
        latitude={userLocation.latitude} // 유저의 위도 값
        longitude={userLocation.longitude} // 유저의 경도 값
        />
        <ButtonWithTextContainer top={120} right={20}>
          <TextLabel>지도 설정</TextLabel>
          <CustomMapButton
            onPress={handlePressSetting}
            iconName="settings-outline"
            inValid={isDisabled}
          />
        </ButtonWithTextContainer>
        <CustomBottomSheet
          modalVisible={isSettingModalVisible}
          setModalVisible={setIsSettingModalVisible}
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
}

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