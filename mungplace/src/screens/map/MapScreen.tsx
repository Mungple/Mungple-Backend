// screens/MapScreen.tsx
import React, {useState} from 'react';
import {View, Button, StyleSheet} from 'react-native';
import MapComponent from '@/components/map/MapComponent';
import useUserLocation from '@/hooks/useUserLocation';

const MapScreen = () => {
  const {userLocation} = useUserLocation();
  const [isFormVisible, setIsFormVisible] = useState(false);

  const handleFormClose = () => {
    setIsFormVisible(false);
  };

  const handleAddMarker = (markerData: any) => {
    // Marker 추가 로직
    console.log('Adding Marker:', markerData);
    // addMarker(markerData); // 예시로 주석 처리, 실제로는 상태 관리 로직을 호출합니다.
  };

  return (
    <View style={styles.container}>
      {userLocation && (
        <>
          <MapComponent
            userLocation={userLocation}
            isFormVisible={isFormVisible}
            onFormClose={handleFormClose}
            onAddMarker={handleAddMarker}
          />
          <View style={styles.buttonContainer}>
            <Button title="Add Marker" onPress={() => setIsFormVisible(true)} />
          </View>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 10,
    left: 10,
    right: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});

export default MapScreen;
