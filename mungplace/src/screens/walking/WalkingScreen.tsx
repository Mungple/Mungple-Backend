import { Alert, Dimensions } from 'react-native';
import React, { useEffect, useState } from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { exitWalk } from '@/api/walk';
import * as WS from './WalkingScreenStyle';
import { colors, mapNavigations } from '@/constants';

import { useAppStore } from '@/state/useAppStore';
import { useMapStore } from '@/state/useMapStore';
import { useUserStore } from '@/state/useUserStore';

import MapComponent from '@/components/map/MapComponent';
import CustomModal from '@/components/common/CustomModal';
import ElapsedTime from '@/components/walking/ElapsedTime';
import CustomButton from '@/components/common/CustomButton';

import useWebSocketActions from '@/hooks/useWebsocketActions';
import { MapStackParamList } from '@/navigations/stack/MapStackNavigator';

// 화면 크기에 맞춰 하단 블록 크기 설정
const bottomBlockHeight = (Dimensions.get('window').height * 1) / 5;
const bottomBlockWidth = Dimensions.get('window').width - 40;

// ========== Main Functional Component ==========
const WalkingScreen = () => {
  // ========== Constants ==========
  // 상태 관리 (앱 스토어 및 맵 스토어에서 상태 추출)
  const markers = useMapStore((state) => state.markers);
  const startExplorate = useAppStore((state) => state.startExplorate);
  const setWalkingStart = useAppStore((state) => state.setWalkingStart);

  // 사용자 위치 및 웹소켓 액션 추출
  const distance = useAppStore((state) => state.distance);
  const clientSocket = useAppStore((state) => state.clientSocket);
  const userLocation = useUserStore((state) => state.userLocation);

  const [modalVisible, setModalVisible] = useState(false);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [path, setPath] = useState<{ latitude: number; longitude: number }[]>([]);
  const { sendLocation, checkAllUserZone, checkMyBlueZone, checkMungPlace } = useWebSocketActions();

  // 네비게이션 훅
  const navigation = useNavigation<NativeStackNavigationProp<MapStackParamList>>();

  // ========== Methods ==========
  // 산책 종료 처리
  const handleWalkingEnd = () => {
    setModalVisible(true);
  };

  // 폼 닫기 처리
  const handleFormClose = () => {
    setIsFormVisible(false);
  };

  // 산책 종료 확인 후 처리
  const confirmEndWalking = () => {
    if (startExplorate) {
      exitWalk(startExplorate.explorationId);
      setWalkingStart(false);
      setModalVisible(false);
      navigation.navigate(mapNavigations.HOME);
    } else {
      Alert.alert('Error', '산책 정보 업데이트가 불가능합니다');
    }
  };

  // 산책 종료 취소 처리
  const cancelEndWalking = () => {
    setModalVisible(false);
  };

  // ========== Side Effects ==========
  // 5초마다 좌표를 수집하여 경로 업데이트
  useEffect(() => {
    if (!userLocation) return;

    const intervalId = setInterval(() => {
      setPath((prevPath) => [
        ...prevPath,
        { latitude: userLocation.lat, longitude: userLocation.lon },
      ]);
    }, 5000);

    // 언마운트 시 Interval 해제
    return () => {
      clearInterval(intervalId);
    };
  }, [path]);

  // 3초마다 웹소켓을 통해 위치 정보 전송
  useEffect(() => {
    if (!userLocation) return;

    const intervalId = setInterval(() => {
      const location = {
        lat: userLocation.lat,
        lon: userLocation.lon,
        recordedAt: new Date().toISOString(),
      };
      sendLocation(Number(startExplorate?.explorationId), location);
    }, 3000);

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  // ========== UI Rendering ==========
  if (!startExplorate) {
    return navigation.goBack();
  }

  return (
    <WS.Container>
      <MapComponent
        path={path}
        markers={markers}
        isFormVisible={isFormVisible}
        onFormClose={handleFormClose}
        bottomOffset={bottomBlockHeight + 20}
        explorationId={startExplorate.explorationId}
        checkMyBlueZone={checkMyBlueZone}
        checkAllUserZone={checkAllUserZone}
        checkMungPlace={checkMungPlace}
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
              <WS.InfoValue>{Number(distance)} km</WS.InfoValue>
            </WS.InfoBlock>
          </WS.InfoRow>
        </WS.WalkingInfo>
        <CustomButton label="산책 종료하기" onPress={handleWalkingEnd} />
      </WS.BottomCard>

      {/* 산책 종료 확인 모달 */}
      <CustomModal modalVisible={modalVisible} setModalVisible={setModalVisible}>
        <Icon size={48} name="alert-circle-outline" color={colors.ORANGE.BASE} />
        <WS.ModalTitle>산책을 종료하시겠습니까?</WS.ModalTitle>
        <WS.ButtonContainer>
          <WS.ConfirmButton label="확인" onPress={confirmEndWalking} />
          <WS.CancelButton label="취소" onPress={cancelEndWalking} />
        </WS.ButtonContainer>
      </CustomModal>
    </WS.Container>
  );
};

export default WalkingScreen;
