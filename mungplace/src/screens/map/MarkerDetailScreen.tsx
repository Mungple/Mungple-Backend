import React, { useEffect, useState } from 'react';
import { View, Text, Button, Image, StyleSheet, ActivityIndicator } from 'react-native';
import axiosInstance from '@/api/axios';
import { MarkerDetails } from '../../state/useMapStore'; // MarkerDetails 타입을 useMapStore에서 가져옵니다.
import { useAppStore } from '@/state/useAppStore';
import { useNavigation, useRoute } from '@react-navigation/native';

const MarkerDetailScreen: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { markerId } = route.params as { markerId: string }; // route.params에서 markerId를 가져옵니다.
  
  const [markerDetails, setMarkerDetails] = useState<MarkerDetails | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const accessToken = useAppStore((state) => state.token);

  useEffect(() => {
    fetchMarkerDetails(markerId);
  }, [markerId]);

  const fetchMarkerDetails = async (markerId: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.get(`/markers/${markerId}`, {
        headers: {
          'Content-Type': 'application/json; charset=utf8',
          'Authorization': `Bearer ${accessToken}`,
        },
      });
      console.log("서버 응답:", response.data);
      setMarkerDetails(response.data);
    } catch (err) {
      setError('마커 디테일을 가져오는 데 실패');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  if (error) {
    return <Text style={styles.errorText}>{error}</Text>;
  }

  if (!markerDetails) {
    return null; // 마커 데이터가 없을 경우 null 반환
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{markerDetails.title}</Text>
      <Text style={styles.content}>{markerDetails.content}</Text>
      <Text style={styles.date}>{`Created at: ${markerDetails.createdAt}`}</Text>
      {markerDetails.images.length > 0 && (
        <View style={styles.imageContainer}>
          {markerDetails.images.map((imageUri, index) => (
            <Image key={index} source={{ uri: imageUri }} style={styles.image} />
          ))}
        </View>
      )}
      <Text style={styles.type}>Type: {markerDetails.type}</Text>
      <Text style={styles.userId}>Created by user: {markerDetails.userId}</Text>
      <Button title="Back" onPress={() => navigation.goBack()} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: 'white',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  content: {
    fontSize: 16,
    marginBottom: 10,
  },
  date: {
    fontSize: 12,
    color: '#888',
    marginBottom: 10,
  },
  imageContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 10,
  },
  image: {
    width: 100,
    height: 100,
    marginRight: 5,
  },
  type: {
    fontSize: 14,
    marginBottom: 10,
  },
  userId: {
    fontSize: 14,
    color: '#666',
  },
  errorText: {
    fontSize: 16,
    color: 'red',
  },
});

export default MarkerDetailScreen;
