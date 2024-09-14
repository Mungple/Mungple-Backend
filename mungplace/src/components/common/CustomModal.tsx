import React from 'react';
import styled from 'styled-components/native';
import {Dimensions, Modal} from 'react-native';

import {colors} from '@/constants';

interface CustomModalProps {
  children?: React.ReactNode;
  modalVisible: boolean;
}

const bottomBlockWidth = Dimensions.get('window').width - 40;

const CustomModal: React.FC<CustomModalProps> = ({
  modalVisible,
  children,
}) => {

  return (
    <Modal
      visible={modalVisible}
      animationType={'fade'}
      transparent
      statusBarTranslucent
    >
      <Overlay>

        {/* 콘텐츠 영역 */}
        <ModalContainer>
          {children}
        </ModalContainer>

      </Overlay>
    </Modal>
  );
};

const Overlay = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.5);
`;

const ModalContainer = styled.View`
  width: ${bottomBlockWidth}px;
  background-color: ${colors.WHITE};
  border-radius: 10px;
  padding: 20px;
  justify-content: center;
  align-items: center;
`;

export default CustomModal;
