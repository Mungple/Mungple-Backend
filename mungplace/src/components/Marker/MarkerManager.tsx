// MarkerManager.tsx
import React, {useState} from 'react';
import {Modal, View, Text, FlatList, Button, Image} from 'react-native';
import MarkerForm from './MarkerForm';
import {MarkerData} from '@/state/useMapStore';

interface MarkerManagerProps {
  userLocation: {latitude: number; longitude: number};
  onAddMarker: (markerData: MarkerData) => void;
  markers: MarkerData[];
  isFormVisible: boolean;
  setFormVisible: (visible: boolean) => void;
}

const MarkerManager: React.FC<MarkerManagerProps> = ({
  userLocation,
  onAddMarker,
  markers,
  isFormVisible,
  setFormVisible,
}) => {
  const [isListVisible, setListVisible] = useState(false);
  const [selectedMarker, setSelectedMarker] = useState<MarkerData | null>(null);
  return (
    <>
      <MarkerForm
        isVisible={isFormVisible}
        onSubmit={markerData => {
          onAddMarker(markerData);
          setFormVisible(false);
        }}
        onClose={() => setFormVisible(false)}
        latitude={userLocation.latitude}
        longitude={userLocation.longitude}
      />

      <Modal
        visible={isListVisible}
        animationType="slide"
        onRequestClose={() => setListVisible(false)}>
        <View>
          <Text>마커들</Text>
          <FlatList
            data={markers}
            keyExtractor={item => item.id}
            renderItem={({item}) => (
              <View>
                <Text>{item.title}</Text>
                <Button
                  title="상세 보기"
                  onPress={() => setSelectedMarker(item)}
                />
              </View>
            )}
          />
          <Button title="닫기" onPress={() => setListVisible(false)} />
        </View>
      </Modal>

      {selectedMarker && (
        <Modal
          visible={true}
          animationType="slide"
          onRequestClose={() => setSelectedMarker(null)}>
          <View>
            <Text>{selectedMarker.title}</Text>
            <Text>{selectedMarker.body}</Text>
            {selectedMarker.imageUri && (
              <Image source={{uri: selectedMarker.imageUri}} />
            )}
            <Button title="닫기" onPress={() => setSelectedMarker(null)} />
          </View>
        </Modal>
      )}
    </>
  );
};

export default MarkerManager;
