import { Alert, Dimensions } from 'react-native';
import React, { useEffect, useState } from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { exitWalk } from '@/api/walk';
import * as WS from './WalkingScreenStyle';
import { useAppStore } from '@/state/useAppStore';
import { useMapStore } from '@/state/useMapStore';
import { colors, mapNavigations } from '@/constants';
import useUserLocation from '@/hooks/useUserLocation';
import MapComponent from '@/components/map/MapComponent';
import CustomModal from '@/components/common/CustomModal';
import ElapsedTime from '@/components/walking/ElapsedTime';
import CustomButton from '@/components/common/CustomButton';
import useWebSocketActions from '@/hooks/useWebsocketActions';
import { MapStackParamList } from '@/navigations/stack/MapStackNavigator';

const bottomBlockHeight = (Dimensions.get('window').height * 1) / 5;
const bottomBlockWidth = Dimensions.get('window').width - 40;

const WalkingScreen = () => {
  // 상태 관리
  const markers = useMapStore((state) => state.markers);
  const startExplorate = useAppStore((state) => state.startExplorate);
  const setWalkingStart = useAppStore((state) => state.setWalkingStart);

  const { userLocation } = useUserLocation();
  const { sendLocation } = useWebSocketActions();
  const distance = useAppStore((state) => state.distance);
  const [modalVisible, setModalVisible] = useState(false);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [path, setPath] = useState<{ latitude: number; longitude: number }[]>([]);

  const navigation = useNavigation<NativeStackNavigationProp<MapStackParamList>>();

  const handleWalkingEnd = () => {
    setModalVisible(true);
  };

  const handleFormClose = () => {
    setIsFormVisible(false);
  };

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

  const cancelEndWalking = () => {
    setModalVisible(false);
  };

  // 5초마다 좌표를 수집하여 경로 업데이트
  useEffect(() => {
    // console.log(path);
    const intervalId = setInterval(() => {
      setPath((prevPath) => [
        ...prevPath,
        { latitude: userLocation.latitude, longitude: userLocation.longitude },
      ]);
    }, 5000);

    return () => {
      clearInterval(intervalId);
      console.log('clearInterval (userLocation)');
    };
  }, [path]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      // lat, lon, recordedAt 데이터 생성
      const jsonData = {
        lat: userLocation.latitude,
        lon: userLocation.longitude,
        recordedAt: new Date().toISOString().replace('T', ' ').substring(0, 19),
      };
      // 산책 ID와 위치 데이터를 서버에 전송
      sendLocation(Number(startExplorate?.explorationId), jsonData);
    }, 5000);

    // 컴포넌트가 언마운트될 때 setInterval을 정리하여 메모리 누수 방지
    return () => {
      clearInterval(intervalId);
      console.log('clearInterval (sendLocation)');
    };
    // 마운트 될때 useEffect 실행
  }, []);

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
            explorationId={startExplorate?.explorationId}
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
        </>
      )}
    </WS.Container>
  );
};

export default WalkingScreen;
