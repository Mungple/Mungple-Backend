import { colors } from '@/constants';
import React, {useEffect, useRef} from 'react';
import { Modal, Animated, TouchableWithoutFeedback, Dimensions, PanResponder} from 'react-native';

import styled from 'styled-components/native';

interface BottomSheetProps {
  setModalVisible: (visible: boolean) => void;
  children?: React.ReactNode;
  modalVisible: boolean;
  height?: number;
}

const BottomSheet: React.FC<BottomSheetProps> = ({
  setModalVisible,
  modalVisible,
  children,
  height = 300,
}) => {
  const screenHeight = Dimensions.get('screen').height;
  const panY = useRef(new Animated.Value(screenHeight)).current;

  // panY 값을 변환하여 translateY로 사용
  const translateY = panY.interpolate({
    inputRange: [0, screenHeight],
    outputRange: [0, screenHeight],
    extrapolate: 'clamp',
  });

  // BottomSheet를 열 때 사용하는 애니메이션 정의
  const resetBottomSheet = Animated.timing(panY, {
    toValue: 0,
    duration: 300,
    useNativeDriver: true,
  });

  // BottomSheet를 닫을 때 사용하는 애니메이션 정의
  const closeBottomSheet = Animated.timing(panY, {
    toValue: screenHeight,
    duration: 300,
    useNativeDriver: true,
  });

  // PanResponder 생성 (제스처 감지)
  const panResponders = useRef(
    PanResponder.create({
      // 터치가 시작될 때 PanResponder 활성화 여부 결정
      onStartShouldSetPanResponder: () => true,
      // 터치 이동 시 PanResponder 활성화 여부 결정
      onMoveShouldSetPanResponder: () => false,
      // 터치 이동 시 호출
      onPanResponderMove: (event, gestureState) => {
        // 아래로 스와이프할 때만 동작하도록 설정
        const newY = Math.max(0, gestureState.dy);
        panY.setValue(newY);
      },
      // 터치가 끝날 때 호출
      onPanResponderRelease: (event, gestureState) => {
        // 아래로 빠르게 스와이프하면 모달 닫기
        if (gestureState.dy > 0 && gestureState.vy > 1.5) {
          closeModal();
        } else {
          // 그렇지 않으면 원래 위치로 복귀
          resetBottomSheet.start();
        }
      },
    }),
  ).current;

  // modalVisible 값이 변경될 때마다 실행되는 효과
  useEffect(() => {
    if (modalVisible) {
      resetBottomSheet.start();
    }
  }, [modalVisible]);

  // 모달을 닫는 함수
  const closeModal = () => {
    closeBottomSheet.start(() => {
      setModalVisible(false);
      panY.setValue(screenHeight);
    });
  };

  return (
    <Modal
      visible={modalVisible}
      animationType={'fade'}
      transparent
      statusBarTranslucent>
      <Overlay>
        {/* 배경을 터치하면 모달 닫기 */}
        <TouchableWithoutFeedback onPress={closeModal}>
          <Background />
        </TouchableWithoutFeedback>
        {/* 애니메이션이 적용된 BottomSheet */}
        <BottomSheetContainer
          style={{transform: [{translateY}], height}}
          {...panResponders.panHandlers}>
          {children}
        </BottomSheetContainer>
      </Overlay>
    </Modal>
  );
};

const Overlay = styled.View`
  flex: 1;
  justify-content: flex-end;
  background-color: rgba(0, 0, 0, 0.4);
`;

const Background = styled.View`
  flex: 1;
`;

const BottomSheetContainer = styled(Animated.View)`
  height: 300px;
  background-color: ${colors.WHITE};
  border-top-left-radius: 12px;
  border-top-right-radius: 12px;
`;

export default BottomSheet;
