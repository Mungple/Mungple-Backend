import React from 'react';
import { View, Text, Modal, FlatList, Button } from 'react-native';

import { getDateWalks, getWalkDetail } from '@/api/walk';

import styled from 'styled-components/native';

interface DayWalksListProps {
  visible: boolean;
  onRequestClose: () => void;
}

const DayWalksList = ({ visible = false, onRequestClose }: DayWalksListProps) => {
  return (
    <Modal visible={visible} transparent={true} onRequestClose={onRequestClose}>
      <Container>
        <Text>하루 기록 리스트</Text>
        <Button title="닫기" onPress={onRequestClose} />
      </Container>
    </Modal>
  );
};

const Container = styled.View`
  width: 100%;
  height: 40%;
  background-color: white;
  border: 1px solid black;
`;

export default DayWalksList;
