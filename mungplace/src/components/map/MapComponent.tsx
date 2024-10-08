// 1. 라이브러리 및 네이티브 기능
import styled from 'styled-components/native';
import { Animated, Image as RNImage } from 'react-native';
import ClusteredMapView from 'react-native-map-clustering';
import React, { useEffect, useRef, useState } from 'react';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import MapView, { Marker, Polyline, PROVIDER_GOOGLE } from 'react-native-maps';

// 2. 커스텀 컴포넌트
import MapSettings from './MapSettings';
import MarkerForm from './MarkerForm';
import CustomMapButton from '../common/CustomMapButton';
import CustomBottomSheet from '../common/CustomBottomSheet';
import CustomText from '../common/CustomText';

// 3. 지도 관련
import MungZoneHeatmap from './MungZoneHeatmap';
import MyBlueZoneHeatmap from './MyBlueZoneHeatmap';
import AllRedZoneHeatmap from './AllRedZoneHeatmap';
import AllBlueZoneHeatmap from './AllBlueZoneHeatmap';

// 4. 리소스 및 이미지
import doghouse from '@/assets/doghouse.png';
import redMarker from '@/assets/redMarker.png';
import blueMarker from '@/assets/blueMarker.png';

// 5. 훅(Hooks)
import useWebSocket from '@/hooks/useWebsocket';
import usePermission from '@/hooks/usePermission';
import useUserLocation from '@/hooks/useUserLocation';
import useMarkersWithinRadius from '@/hooks/useMarkersWithinRadius';

// 6. 상태 관리 및 데이터
import { ToMungZone, ToZone } from '@/types';
import { fetchWithPetPlace } from '@/api/map';
import { colors, mapNavigations } from '@/constants';
import { useMapStore, MarkerData } from '@/state/useMapStore';

// 7. 네비게이션 타입
import { MapStackParamList } from '@/navigations/stack/MapStackNavigator';

// 컴포넌트에 전달되는 props 정의
interface MapComponentProps {
  userLocation: { latitude: number; longitude: number };
  path?: { latitude: number; longitude: number }[];
  bottomOffset?: number;
  markers?: MarkerData[]; // 마커 생성 용
  isFormVisible: boolean;
  onFormClose: () => void;
  explorationId?: number;
  checkMyBlueZone: (myBlueZone: ToZone) => void;
  checkAllUserZone: (zoneType: number, allUserZone: ToZone) => void;
  checkMungPlace: (allUserZone: ToMungZone) => void;
}

// ========== Main Functional Component ==========
const MapComponent: React.FC<MapComponentProps> = ({
  userLocation,
  bottomOffset = 0,
  path = [],
  explorationId = -1,
  checkMyBlueZone,
  checkAllUserZone,
  checkMungPlace,
}) => {
  useMarkersWithinRadius();
  // ========== Constants ==========
  // 애니메이션 값 및 상태 관리
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(0)).current;

  // 상태 관리 및 리액트 훅
  const [isDisabled, setIsDisabled] = useState(true);
  const [formVisible, setFormVisible] = useState(false);
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const petFacilities = useMapStore((state) => state.petFacilities);
  const [isSettingModalVisible, setIsSettingModalVisible] = useState(false);
  const [visibleElements, setVisibleElements] = useState({
    blueZone: false,
    redZone: false,
    mungZone: false,
    convenienceInfo: true,
    myBlueZone: false,
    redMarkers: true,
    blueMarkers: true,
  });

  // 지도 관련 레퍼런스 및 위치 상태
  const mapRef = useRef<MapView | null>(null);
  const { isUserLocationError } = useUserLocation();
  const setPetFacilities = useMapStore((state) => state.setPetFacilities);
  const navigation = useNavigation<NativeStackNavigationProp<MapStackParamList>>();
  const { myBlueZone, allBlueZone, allRedZone, mungZone } = useWebSocket(explorationId);

  // 마커 처리 및 업데이트
  const { addMarker } = useMapStore();
  const nearbyMarkers = useMapStore((state) => state.nearbyMarkers);
  const updatedMarkers: {
    markerId: string;
    userId: number;
    createdAt: string;
    type: string;
    lat: number;
    lon: number;
  }[] = [];

  if (nearbyMarkers && nearbyMarkers.markersGroupedByGeohash) {
    // 모든 geohash에 대해 순회
    Object.keys(nearbyMarkers.markersGroupedByGeohash).forEach((key) => {
      const cluster = nearbyMarkers.markersGroupedByGeohash[key];
      const { markers, geohashCenter } = cluster; // 클러스터에서 마커와 중심 좌표 추출

      // 각 클러스터의 마커에 대해 처리
      markers.forEach((marker) => {
        updatedMarkers.push({
          markerId: marker.markerId,
          userId: marker.userId,
          createdAt: marker.createdAt,
          type: marker.type,
          lat: geohashCenter.lat, // 클러스터 중심의 위도
          lon: geohashCenter.lon, // 클러스터 중심의 경도
        });
      });
    });
  }

  usePermission('LOCATION');

  // ========== Methods ==========
  // 지도 요소 토글 함수
  const toggleElementVisibility = (element: keyof typeof visibleElements) => {
    setVisibleElements((prev) => ({
      ...prev,
      [element]: !prev[element],
    }));
  };

  // 유저의 위치를 호출하는 함수
  const handlePressUserLocation = () => {
    if (userLocation && !isUserLocationError) {
      mapRef.current?.animateToRegion({
        latitude: userLocation.latitude,
        longitude: userLocation.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      });
    }
  };

  // 마커 등록 하기
  const handleMarkerSubmit = (markerData: MarkerData) => {
    addMarker(markerData);
    setFormVisible(false);
  };

  // 마커 클릭 시 호출되는 함수 (상세정보 호출)
  const handleMarkerClick = (markerId: string) => {
    // 데이터 구조에서 모든 클러스터를 순회
    if (nearbyMarkers) {
      Object.keys(nearbyMarkers.markersGroupedByGeohash).forEach((geohash) => {
        const cluster = nearbyMarkers.markersGroupedByGeohash[geohash];

        // 각 클러스터의 markers 배열을 순회
        const marker = cluster.markers.find((m) => m.markerId === markerId);

        // 해당 markerId가 있는 경우 상세 페이지로 이동
        if (marker) {
          navigation.navigate(mapNavigations.MARKERDETAIL, { markerId });
          console.log(`마커 클릭 : ${markerId}`);
        }
      });
    }
  };

  // 애견 동반 가능 시설 조회 함수
  const handleFacilityMarkerPress = async (facilityId: number) => {
    navigation.navigate(mapNavigations.FACILITYDETAIL, { facilityId });
  };
  // 내 마커 조회 함수
  const handleViewMyMarkers = () => {
    navigation.navigate('MyMarkerList');
  };

  // 메뉴 햄버거 바 클릭 시 호출되는 함수
  const handlePressMenu = () => {
    setIsMenuVisible((prev) => !prev);
    const animationTargets = isMenuVisible
      ? { translateY: 0, opacity: 0 }
      : { translateY: 80, opacity: 1 };

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
    handlePressMenu();
  };

  // ========== Side Effects ==========
  // 화면을 떠날 때 WebSocket 연결 해제
  useFocusEffect(
    React.useCallback(() => {
      console.log('MapComponent focused >>> WebSocket connected');
      return () => {
        console.log('MapComponent unfocused >>> WebSocket disconnected');
      };
    }, []),
  );

  useEffect(() => {
    const getPetFacilities = async () => {
      if (userLocation) {
        const petFacilities = await fetchWithPetPlace(
          userLocation.latitude,
          userLocation.longitude,
        );
        const facilityPoints = petFacilities.facilityPoints;
        setPetFacilities(facilityPoints);
      }
    };
    getPetFacilities();
  }, [userLocation]);

  // ========== UI Rendering ==========
  return (
    <Container>
      <ClusteredMapView
        ref={mapRef}
        provider={PROVIDER_GOOGLE}
        showsUserLocation
        followsUserLocation
        showsMyLocationButton={false}
        initialRegion={{
          latitude: userLocation.latitude,
          longitude: userLocation.longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
        minZoomLevel={15}
        maxZoomLevel={20}
        style={{ flex: 1 }}
        clusteringEnabled={true}
        clusterColor={colors.ORANGE.DARKER}>
        {/* 블루 마커 */}
        {visibleElements.blueMarkers &&
          updatedMarkers
            .filter((marker) => marker.type === 'BLUE')
            .map((marker) => (
              <Marker
                key={marker.markerId}
                coordinate={{
                  latitude: marker.lat,
                  longitude: marker.lon,
                }}
                onPress={() => handleMarkerClick(marker.markerId)}>
                <MarkerImage source={blueMarker} />
              </Marker>
            ))}

        {/* 레드 마커 */}
        {visibleElements.redMarkers &&
          updatedMarkers
            .filter((marker) => marker.type === 'RED')
            .map((marker) => (
              <Marker
                key={marker.markerId}
                coordinate={{
                  latitude: marker.lat,
                  longitude: marker.lon,
                }}
                onPress={() => handleMarkerClick(marker.markerId)}>
                <MarkerImage source={redMarker} />
              </Marker>
            ))}

        {/* Polyline */}
        {path.length > 1 && (
          <Polyline
            coordinates={path}
            strokeColor={colors.ORANGE.LIGHTER} // 필요에 따라 색상 변경
            strokeWidth={5}
          />
        )}

        {/* 개인 블루존 히트맵 */}
        {visibleElements.myBlueZone && (
          <MyBlueZoneHeatmap myBlueZone={myBlueZone} checkMyBlueZone={checkMyBlueZone} />
        )}
        {/* 전체 블루존 히트맵 */}
        {visibleElements.blueZone && (
          <AllBlueZoneHeatmap allBlueZone={allBlueZone} checkAllUserZone={checkAllUserZone} />
        )}
        {/* 전체 레드존 히트맵 */}
        {visibleElements.redZone && (
          <AllRedZoneHeatmap allRedZone={allRedZone} checkAllUserZone={checkAllUserZone} />
        )}
        {/* 멍존 히트맵 */}
        {visibleElements.mungZone && (
          <MungZoneHeatmap mungZone={mungZone} checkMungPlace={checkMungPlace} />
        )}
        {/* 동반 시설 마커 */}
        {visibleElements.convenienceInfo &&
          petFacilities.map((facility) => (
            <Marker
              key={facility.id}
              coordinate={{
                latitude: facility.point.lat,
                longitude: facility.point.lon,
              }}
              onPress={() => handleFacilityMarkerPress(facility.id)}>
              <MarkerImage source={doghouse} />
            </Marker>
          ))}
      </ClusteredMapView>

      {/* 커스텀 맵 버튼 */}
      <CustomMapButton onPress={handlePressMenu} iconName="menu" top={20} right={20} />

      <Animated.View
        style={{
          transform: [{ translateY }],
          opacity,
          position: 'absolute',
          top: 0,
          right: 0,
        }}>
        <ButtonWithTextContainer top={40} right={20}>
          <TextLabel>
            <CustomText fontSize={26}>
              마커 등록
            </CustomText>
          </TextLabel>
          <CustomMapButton
            onPress={() => {
              setFormVisible(true);
            }}
            iconName="location-outline"
            inValid={false}
          />
        </ButtonWithTextContainer>
        {/* MarkerForm 모달 */}
        <MarkerForm
          isVisible={formVisible}
          onSubmit={handleMarkerSubmit}
          onClose={() => setFormVisible(false)}
          latitude={userLocation.latitude || 35.096406}
          longitude={userLocation.longitude || 128.853919}
        />
        <ButtonWithTextContainer top={120} right={20}>
          <TextLabel>
            <CustomText fontSize={26}>
              지도 설정
            </CustomText>
          </TextLabel>
          <CustomMapButton
            onPress={handlePressSetting}
            iconName="settings-outline"
            inValid={isDisabled}
          />
        </ButtonWithTextContainer>
        <CustomBottomSheet
          modalVisible={isSettingModalVisible}
          setModalVisible={setIsSettingModalVisible}
          menuName="지도 설정"
          height={500}>
          <MapSettings
            visibleElements={visibleElements}
            toggleElementVisibility={toggleElementVisibility}
          />
        </CustomBottomSheet>
        <ButtonWithTextContainer top={200} right={20}>
          <TextLabel>
            <CustomText fontSize={26}>
              내 마커 보기
            </CustomText>
          </TextLabel>
          <CustomMapButton onPress={handleViewMyMarkers} iconName="location" inValid={isDisabled} />
        </ButtonWithTextContainer>
      </Animated.View>

      <CustomMapButton
        onPress={handlePressUserLocation}
        iconName="locate"
        bottom={20 + bottomOffset}
        left={20}
      />
      <CustomMapButton onPress={() => {}} iconName="reload" bottom={20 + bottomOffset} right={20} />
    </Container>
  );
};

const Container = styled.View`
  flex: 1;
`;

const MarkerImage = styled(RNImage)`
  width: 30px;
  height: 30px;
`;

const ButtonWithTextContainer = styled.View<{ top?: number; right?: number }>`
  position: absolute;
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;
  top: ${({ top }) => top || 0}px;
  right: ${({ right }) => right || 0}px;
`;

const TextLabel = styled.Text`
  margin-right: 80px;
  font-size: 24px;
  font-weight: bold;
  color: black;
`;

export default MapComponent;
