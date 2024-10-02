import React from 'react';
import { Modal, View, StyleSheet, Text, FlatList, TouchableOpacity } from 'react-native';
import { NearbyMarkerData } from '@/state/useMapStore'

interface ClusterModalProps {
  isVisible: boolean;
  markers: NearbyMarkerData[]
  onClose: () => void; // 모달 닫기 함수
  fetchMarkerDetails: (markerId: string) => void; // 마커 상세 정보를 가져오는 함수
}

const ClusterModal: React.FC<ClusterModalProps> = ({ isVisible, markers, onClose, fetchMarkerDetails }) => {
  const renderItem = ({ item }: { item: NearbyMarkerData }) => (
    <TouchableOpacity onPress={() => fetchMarkerDetails(item.markerId)}>
      <Text style={styles.markerText}>Marker ID: {item.markerId}</Text>
      <Text style={styles.markerText}>User ID: {item.userId}</Text>
      <Text style={styles.markerText}>Type: {item.type}</Text>
    </TouchableOpacity>
  );

  return (
    <Modal visible={isVisible} animationType="slide" onRequestClose={onClose}>
      <View style={styles.modalContainer}>
        {markers.length > 0 ? (
          <FlatList
            data={markers}
            renderItem={renderItem}
            keyExtractor={(item) => item.markerId}
            contentContainerStyle={styles.list}
          />
        ) : (
          <Text>No markers available.</Text>
        )}
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    padding: 20,
  },
  markerText: {
    fontSize: 16,
    marginBottom: 10,
  },
  list: {
    paddingBottom: 20,
  },
});

export default ClusterModal;
