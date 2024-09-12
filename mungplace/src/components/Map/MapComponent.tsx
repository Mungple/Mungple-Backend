// components/MapComponent.tsx
import React, { useEffect, useState } from 'react';
import { View, Image, StyleSheet, Text, TouchableOpacity } from 'react-native';
import MapView, { Heatmap, Marker, Polygon } from 'react-native-maps';
import cluster from 'points-cluster';
import geohash from 'ngeohash';
import mungPleMarker from '../../assets/mungPleMarker.png';
import { useMapStore } from '../../state/useMapStore';
import MarkerForm from '../Marker/MarkerForm';

interface MapComponentProps {
  userLocation: { latitude: number, longitude: number };
  isFormVisible: boolean;
  onFormClose: () => void;
  onAddMarker: (markerData: any) => void;
}

const MapComponent: React.FC<MapComponentProps> = ({ userLocation, isFormVisible, onFormClose, onAddMarker }) => {
  const {
    showPersonalBlueZone, showGlobalBlueZone, showRedZone, showMungPlace, showUserMarkers,
    togglePersonalBlueZone, toggleGlobalBlueZone, toggleRedZone, toggleMungPlace,
    fetchPersonalBlueZone, fetchGlobalBlueZone, fetchMungPlace, fetchRedZone,
    personalBlueZones, globalBlueZones, redZones, mungPlaces, markers, addMarker
  } = useMapStore();
  
  const [clusteredMarkers, setClusteredMarkers] = useState<any[]>([]);
  const [selectedCluster, setSelectedCluster] = useState<any[]>([]);

  useEffect(() => {
    fetchPersonalBlueZone(userLocation.latitude, userLocation.longitude);
    fetchGlobalBlueZone(userLocation.latitude, userLocation.longitude);
    fetchRedZone(userLocation.latitude, userLocation.longitude);
    fetchMungPlace(userLocation.latitude, userLocation.longitude);
  }, [userLocation]);

  useEffect(() => {
    if (markers.length > 0) {
      const clustered = cluster(
        markers.map(marker => ({
          latitude: marker.latitude,
          longitude: marker.longitude,
          id: marker.id
        })),
        { radius: 100 }
      );
      setClusteredMarkers(clustered);
    }
  }, [markers]);

  const handleClusterPress = (cluster: any) => {
    if (cluster.cluster) {
      setSelectedCluster(cluster.cluster.map((c: any) => ({
        id: c.id,
        latitude: c.latitude,
        longitude: c.longitude,
        title: c.title,
        body: c.body
      })));
    } else {
      console.log('Clustered Marker Clicked:', cluster);
    }
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
        minZoomLevel={15}
        maxZoomLevel={20}
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

      {isFormVisible && userLocation && (
        <MarkerForm
          onSubmit={(markerData) => {
            onAddMarker(markerData);
            onFormClose();
          }}
          onClose={onFormClose}
          latitude={userLocation.latitude}
          longitude={userLocation.longitude}
        />
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
});

export default MapComponent;
