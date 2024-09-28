import React from 'react';
import styled from 'styled-components/native';
import {Dimensions, Modal} from 'react-native';

import {colors} from '@/constants';

interface CustomModalProps {
  height?: number;
  isWide?: boolean;
  modalVisible: boolean;
  children?: React.ReactNode;
  setModalVisible: (visible: boolean) => void;
}

const windowWidth = Dimensions.get('window').width;

const CustomModal: React.FC<CustomModalProps> = ({
  height,
  isWide = false,
  children,
  modalVisible,
  setModalVisible,
}) => {
  const closeModal = () => {
    setModalVisible(false);
  };

  return (
    <Modal
      visible={modalVisible}
      animationType={'fade'}
      transparent
      statusBarTranslucent
    >
      <Overlay onPress={closeModal}>
        <ModalContainer isWide={isWide} height={height}>
          {children}
        </ModalContainer>
      </Overlay>
    </Modal>
  );
};

const Overlay = styled.Pressable`
  flex: 1;
  align-items: center;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.5);
`;

const ModalContainer = styled.Pressable<{isWide: boolean; height?: number;}>`
  flex: 1;
  position: absolute;
  align-items: center;
  border-radius: 10px;
  width: ${windowWidth - 40}px;
  background-color: ${colors.WHITE};
  padding: ${({isWide}) => isWide ? 0 : 20}px;
  height: ${({height}) => height ? `${height}px` : 'auto'};
`;

export default CustomModal;
