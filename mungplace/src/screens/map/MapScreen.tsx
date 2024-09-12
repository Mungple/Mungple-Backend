import React, { useEffect, useState } from 'react';
import { View, Button, StyleSheet, Alert, Linking, ActivityIndicator, Image, TouchableOpacity, Text } from 'react-native';
import MapView, { Heatmap, Marker, Polygon } from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';
import { useMapStore } from '../../state/useMapStore'; // Zustand 상태 관리
import MarkerForm from '../../components/Marker/MarkerForm'; // MarkerForm 임포트
import { request, PERMISSIONS, RESULTS } from 'react-native-permissions'; // 권한 요청 관련 import
import cluster from 'points-cluster';
import geohash from 'ngeohash'
import mungPleMarker from '../../assets/mungPleMarker.png';

const MapScreen = () => {
  const { 
    showPersonalBlueZone, showGlobalBlueZone, showRedZone, showMungPlace, showUserMarkers,
    togglePersonalBlueZone, toggleGlobalBlueZone, toggleRedZone, toggleMungPlace,
    fetchPersonalBlueZone, fetchGlobalBlueZone, fetchRedZone, fetchMungPlace,
    personalBlueZones, globalBlueZones, redZones, mungPlaces, markers, addMarker
  } = useMapStore();
  
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [loading, setLoading] = useState(true);

  const [clusteredMarkers, setClusteredMarkers] = useState<any[]>([]);
  const [selectedCluster, setSelectedCluster] = useState<any[]>([]);

  useEffect(() => {
    const checkLocationPermission = async () => {
      try {
        const result = await request(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION);
        console.log('위치 정보 요청 결과:', result);

        if (result === RESULTS.GRANTED) {
          Geolocation.getCurrentPosition(
            position => {
              const { latitude, longitude } = position.coords;
              setUserLocation({ latitude, longitude });
              fetchPersonalBlueZone(latitude, longitude);
              fetchGlobalBlueZone(latitude, longitude);
              fetchRedZone(latitude, longitude);
              fetchMungPlace(latitude, longitude);
              setLoading(false); // 위치 정보 로드 완료
            },
            error => {
              console.log('Geolocation error:', error);
              setLoading(false); // 위치 정보 로드 실패
              Alert.alert('Location Error', '당신의 위치를 로드할 수 없습니다.');
            },
            { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
          );
        } else if (result === RESULTS.DENIED) {
          Alert.alert(
            '위치 정보 허용이 필요합니다.',
            '이 앱은 당신의 위치에 접근하기 위해 위치 정보 허용이 필요합니다.',
            [{ text: 'OK' }]
          );
        } else if (result === RESULTS.BLOCKED) {
          Alert.alert(
            '위치 정보 허용이 차단된 상태입니다.',
            '위치 정보 허용이 차단된 상태입니다. 앱 설정을 바꿔 주시길 바랍니다.',
            [{ text: 'Open Settings', onPress: () => Linking.openSettings() }]
          );
        }
      } catch (error) {
        console.error('Permission check error:', error);
        setLoading(false);
        Alert.alert('Permission Error', 'Unable to check location permissions.');
      }
    };

    checkLocationPermission();
  }, []);

  useEffect(() => {
    if (markers.length > 0) {
      const clustered = cluster(
        markers.map(marker => ({
          latitude: marker.latitude,
          longitude: marker.longitude,
          id: marker.id
        })),
        { radius: 100 } // 클러스터링 반경 조정
      );
      setClusteredMarkers(clustered);
    }
  }, [markers]);

  const handleClusterPress = (cluster: any) => {
    if (cluster.cluster) {
      // 클러스터의 마커들만 선택
      setSelectedCluster(cluster.cluster.map((c: any) => ({
        id: c.id,
        latitude: c.latitude,
        longitude: c.longitude,
        title: c.title,
        body: c.body
      })));
    } else {
      // 개별 마커 클릭 시 상세 페이지로 이동
      console.log('Clustered Marker Clicked:', cluster);
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: userLocation?.latitude || 35.096406,
          longitude: userLocation?.longitude || 128.853919,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
      >
         {/* 클러스터링된 마커 */}
         {showUserMarkers && clusteredMarkers.map((cluster: any) => (
          <React.Fragment key={`cluster-${cluster.latitude}-${cluster.longitude}`}>
            {cluster.cluster ? (
              <Marker
                coordinate={{ latitude: cluster.latitude, longitude: cluster.longitude }}
                onPress={() => handleClusterPress(cluster)}
              >
                <View style={styles.clusterContainer}>
                  <Text style={styles.clusterText}>{cluster.count}</Text>
                </View>
              </Marker>
            ) : (
              <Marker
                coordinate={{ latitude: cluster.latitude, longitude: cluster.longitude }}
                title={cluster.title}
                description={cluster.body}
                onPress={() => handleClusterPress(cluster)}
              >
                <Image
                  source={mungPleMarker}
                  style={{ width: 30, height: 30 }}
                />
              </Marker>
            )}
          </React.Fragment>
        ))}

        {/* 개인 블루존 히트맵 */}
        {showPersonalBlueZone && (
          <Heatmap
            points={personalBlueZones.map(zone => ({
              latitude: zone.latitude,
              longitude: zone.longitude,
              weight: zone.weight || 1,
            }))}
          />
        )}

        {/* 전체 블루존 히트맵 */}
        {showGlobalBlueZone && (
          <Heatmap
            points={globalBlueZones.map(zone => ({
              latitude: zone.latitude,
              longitude: zone.longitude,
              weight: zone.weight || 1,
            }))}
          />
        )}

        {/* 레드존 */}
        {showRedZone && (
          <Heatmap
            points={redZones.map((zone) => ({
              latitude: zone.latitude,
              longitude: zone.longitude,
              weight: zone.weight || 1,
            }))}
            radius={50}
            opacity={0.6}
          />
        )}

        {/* 멍플레이스 */}
        {showMungPlace && mungPlaces.map((place) => {
          const hash = geohash.encode(place.latitude, place.longitude, 6);
          const { latitude, longitude } = geohash.decode(hash);
          const delta = 0.001;
          const coordinates = [
            { latitude: latitude - delta, longitude: longitude - delta },
            { latitude: latitude - delta, longitude: longitude + delta },
            { latitude: latitude + delta, longitude: longitude + delta },
            { latitude: latitude + delta, longitude: longitude - delta },
          ];

          return (
            <React.Fragment key={`${place.latitude}-${place.longitude}`}>
              <Polygon
                coordinates={coordinates}
                fillColor="rgba(255, 255, 0, 0.3)"
                strokeColor="rgba(255, 255, 0, 0.7)"
              />

              <Marker
                coordinate={{ latitude, longitude }}
                key={`marker-${place.latitude}-${place.longitude}`}
              >
                <Image
                  source={mungPleMarker}
                  style={{ width: 30, height: 30 }}
                />
              </Marker>
            </React.Fragment>
          );
        })}
      </MapView>

      <View style={styles.buttonContainer}>
        <Button title={`Personal BlueZone`} onPress={togglePersonalBlueZone} />
        <Button title={`Global BlueZone`} onPress={toggleGlobalBlueZone} />
        <Button title={`RedZone`} onPress={toggleRedZone} />
        <Button title={`MungPlace`} onPress={toggleMungPlace} />
        <Button
          title="Add Marker"
          onPress={() => setIsFormVisible(true)}
        />
      </View>

      {isFormVisible && userLocation && (
        <MarkerForm
          onSubmit={(markerData) => {
            addMarker(markerData);
            setIsFormVisible(false);
          }}
          onClose={() => setIsFormVisible(false)}
          latitude={userLocation.latitude}
          longitude={userLocation.longitude}
        />
      )}

      {selectedCluster.length > 0 && (
        <View style={styles.clusterDetails}>
          {selectedCluster.map((item) => (
            <TouchableOpacity
              key={item.id}
              onPress={() => {
                // 제목을 클릭하면 마커 상세 페이지로 이동
                console.log(`Navigate to Marker ${item.id}`);
                // 네비게이션 라이브러리를 통해 상세 페이지로 이동
                // 예를 들어, `navigation.navigate('MarkerDetail', { id: item.id })`
              }}
            >
              <Text>{item.title}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
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
  clusterContainer: {
    backgroundColor: '#ff6347',
    padding: 10,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  clusterText: {
    color: '#fff',
    fontSize: 14,
  },
  clusterDetails: {
    position: 'absolute',
    bottom: 50,
    left: 10,
    right: 10,
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 10,
    maxHeight: 150,
    overflow: 'scroll',
  },
});

export default MapScreen;
