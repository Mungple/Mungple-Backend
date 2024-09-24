// src/screens/marker/ClusterMarkerList.tsx
import React from 'react';
import { Modal, View, Text, FlatList, Button, StyleSheet } from 'react-native';
import { MarkerData } from '@/state/useMapStore';

interface ClusterMarkerListProps {
  isVisible: boolean;
  clusterMarkers: MarkerData[];
  onMarkerPress: (marker: MarkerData) => void;
  onClose: () => void;
}

const ClusterMarkerList: React.FC<ClusterMarkerListProps> = ({
  isVisible,
  clusterMarkers,
  onMarkerPress,
  onClose,
}) => {
  return (
    <Modal visible={isVisible} animationType="slide" onRequestClose={onClose}>
      <View style={styles.modalContainer}>
        <Text style={styles.modalTitle}>Clustered Markers</Text>
        <FlatList
          data={clusterMarkers}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.listItem}>
              <Text>{item.title}</Text>
              <Button title="Details" onPress={() => onMarkerPress(item)} />
            </View>
          )}
        />
        <Button title="Close" onPress={onClose} />
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
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

export default ClusterMarkerList;
