import React, { useEffect, useState } from 'react';
import { View, Text, Button, Image, StyleSheet, ActivityIndicator, ScrollView } from 'react-native';
import axiosInstance from '@/api/axios';
import { MarkerDetails } from '../../state/useMapStore'; // MarkerDetails 타입을 useMapStore에서 가져옵니다.
import { useAppStore } from '@/state/useAppStore';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useUserStore } from '@/state/useUserStore';

const MarkerDetailScreen: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { markerId } = route.params as { markerId: string }; // route.params에서 markerId를 가져옵니다.
  const [markerDetails, setMarkerDetails] = useState<MarkerDetails | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const accessToken = useAppStore(state => state.token)
  const currentUserId = useUserStore(state => state.userId)

  useEffect(() => {
    fetchMarkerDetails(markerId);
    
  }, [markerId]);

  const BASE_IMAGE_URL = 'http://j11e106.p.ssafy.io:9000/images/'

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

      const imageWithUrl = response.data.images.map(imageName => BASE_IMAGE_URL + imageName)

      setMarkerDetails({...response.data, images: imageWithUrl});
    } catch (err) {
      setError('마커 디테일을 가져오는 데 실패');
      console.log(err)
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      const response = await axiosInstance.delete(`/markers/${markerId}`, {
        headers: {
          'Content-Type': 'application/json; charset=utf8',
          'Authorization': `Bearer ${accessToken}`,
        },
      });
      
      if (response.status === 202) {
        console.log('마커 삭제 성공');
        setTimeout(() => {
          navigation.goBack();
        }, 100); // 100ms 후에 goBack 호출
      }
    } catch (err) {
      console.log('마커 삭제 중 에러 발생:', err);
      
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const options = { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hour12: false }
    return date.toLocaleString('ko-KR', options).replace(',', '') // 한국어 형식 변환
  }

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
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>{markerDetails.title}</Text>
      <Text style={styles.content}>{markerDetails.content}</Text>
      <Text style={styles.date}>{`${formatDate(markerDetails.createdAt)}에 생성됨`}</Text>
      
      {markerDetails.images.length > 0 && (
        <View style={styles.imageContainer}>
          {markerDetails.images.map((imageUri, index) => (
            <Image key={index} source={{ uri: imageUri }} style={styles.image} />
          ))}
        </View>
      )}
      
      <Text style={styles.userId}>작성자: {markerDetails.userId}</Text>
      
      {/* 현재 접속한 유저와 작성자가 동일할 때만 삭제 버튼 렌더링 */}
      {currentUserId === markerDetails.userId && (
        <Button title="삭제" onPress={handleDelete} color="#d9534f" />
      )}
      
      <Button title="Back" onPress={() => navigation.goBack()} color="#5bc0de" />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
    margin: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#2c3e50',
  },
  content: {
    fontSize: 16,
    marginBottom: 10,
    color: '#34495e',
  },
  date: {
    fontSize: 14,
    marginBottom: 20,
    color: '#95a5a6',
    textAlign: 'right',
  },
  imageContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  image: {
    width: '48%',
    height: 100,
    borderRadius: 8,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ecf0f1',
    resizeMode: 'cover',
  },
  userId: {
    fontSize: 14,
    marginBottom: 20,
    color: '#7f8c8d',
    fontStyle: 'italic',
  },
});

export default MarkerDetailScreen;
