import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { NearbyMarkerData } from '@/state/useMapStore';

interface MarkerListProps {
  markersGroupedByGeohash: {
    [key: string]: { markers: NearbyMarkerData[] };
  };
  onMarkerSelect: (markerId: string) => void;
}

const MarkerList: React.FC<MarkerListProps> = ({ markersGroupedByGeohash, onMarkerSelect }) => {
  // 모든 클러스터의 마커를 하나의 배열로 평평하게(flatten)
  const flattenedMarkers = Object.values(markersGroupedByGeohash)
    .map((cluster) => cluster.markers)
    .flat();

  // 마커 리스트 렌더링
  const renderItem = ({ item }: { item: NearbyMarkerData }) => (
    <TouchableOpacity style={styles.markerItem} onPress={() => onMarkerSelect(item.markerId)}>
      <Text style={styles.markerUserId}>작성자: {item.userId}</Text>
      <Text style={styles.markerCreatedAt}>작성일: {new Date(item.createdAt).toLocaleDateString()}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {flattenedMarkers.length > 0 ? (
        <FlatList
          data={flattenedMarkers}
          renderItem={renderItem}
          keyExtractor={(item) => item.markerId}
          contentContainerStyle={styles.list}
        />
      ) : (
        <Text>마커가 없습니다.</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  list: {
    paddingBottom: 16,
  },
  markerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    padding: 10,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
  },
  markerImage: {
    width: 40,
    height: 40,
    marginRight: 10,
  },
  markerUserId: {
    fontSize: 16,
    flex: 1,
  },
  markerCreatedAt: {
    fontSize: 12,
    color: '#666',
  },
});

export default MarkerList;
