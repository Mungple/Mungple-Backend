import {Alert, Dimensions} from 'react-native';
import React, {useEffect, useState} from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';

import * as WS from './WalkingScreenStyle';
import {useAppStore} from '@/state/useAppStore';
import {colors, mapNavigations} from '@/constants';
import useUserLocation from '@/hooks/useUserLocation';
import MapComponent from '@/components/map/MapComponent';
import CustomModal from '@/components/common/CustomModal';
import ElapsedTime from '@/components/walking/ElapsedTime';
import CustomButton from '@/components/common/CustomButton';
import {MapStackParamList} from '@/navigations/stack/MapStackNavigator';
import { exitWalk } from '@/api/walk';
import { useMapStore } from '@/state/useMapStore';

const bottomBlockHeight = (Dimensions.get('window').height * 1) / 5;
const bottomBlockWidth = Dimensions.get('window').width - 40;

const WalkingScreen = () => {
  const {userLocation} = useUserLocation();
  const [distance, setDistance] = useState(0);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const startExplorate = useAppStore(state => state.startExplorate);
  const setWalkingStart = useAppStore(state => state.setWalkingStart);
  const [path, setPath] = useState<{latitude: number; longitude: number}[]>([]);
  const markers = useMapStore(state => state.markers)

  const navigation = useNavigation<NativeStackNavigationProp<MapStackParamList>>();

  const handleWalkingEnd = () => {
    setModalVisible(true);
  };

  const handleFormClose = () => {
    setIsFormVisible(false);
  };

  const handleAddMarker = (markerData: unknown) => {
    console.log('Adding Marker:', markerData);
  };

  const confirmEndWalking = () => {
    if (startExplorate) {
      console.log(startExplorate.explorationId)
      exitWalk(startExplorate.explorationId)
      setWalkingStart(false);
      setModalVisible(false);
      console.log('산책 종료')
      navigation.navigate(mapNavigations.HOME);
    } else {
      Alert.alert('Error', '산책 정보가 업데이트 불가합니다')
    }
  };

  const cancelEndWalking = () => {
    setModalVisible(false);
  };

  // 5초마다 좌표를 수집하여 경로 업데이트
  useEffect(() => {
    const intervalId = setInterval(() => {
      if (userLocation) {
        // 새로운 좌표를 경로에 추가
        setPath(prevPath => [...prevPath, userLocation]);
      }
    }, 5000);

    // 컴포넌트 언마운트 시 interval 정리
    return () => clearInterval(intervalId);
  }, [userLocation]);

  return (
    <WS.Container>
      {userLocation && (
        <>
          <MapComponent
            path={path}
            markers={markers}
            userLocation={userLocation}
            isFormVisible={isFormVisible}
            onFormClose={handleFormClose}
            bottomOffset={bottomBlockHeight + 20}
          />

          {/* 하단 상태 정보 */}
          <WS.BottomCard height={bottomBlockHeight} width={bottomBlockWidth}>
            <WS.WalkingInfo>
              <WS.InfoRow>
                <WS.InfoBlock>
                  <WS.InfoLabel>소요 시간</WS.InfoLabel>
                  <ElapsedTime />
                </WS.InfoBlock>
                <WS.InfoBlock>
                  <WS.InfoLabel>이동 거리</WS.InfoLabel>
                  <WS.InfoValue>{distance.toFixed(1)} km</WS.InfoValue>
                </WS.InfoBlock>
              </WS.InfoRow>
            </WS.WalkingInfo>
            <CustomButton label="산책 종료하기" onPress={handleWalkingEnd} />
          </WS.BottomCard>

          {/* 산책 종료 확인 모달 */}
          <CustomModal
            modalVisible={modalVisible}
            setModalVisible={setModalVisible}>
            <Icon
              size={48}
              name="alert-circle-outline"
              color={colors.ORANGE.BASE}
            />
            <WS.ModalTitle>산책을 종료하시겠습니까?</WS.ModalTitle>
            <WS.ButtonContainer>
              <WS.ConfirmButton label="확인" onPress={confirmEndWalking} />
              <WS.CancelButton label="취소" onPress={cancelEndWalking} />
            </WS.ButtonContainer>
          </CustomModal>
        </>
      )}
    </WS.Container>
  );
};

export default WalkingScreen;
