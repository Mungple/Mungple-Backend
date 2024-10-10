import React, { useEffect, useState } from 'react';
import { View, Image, StyleSheet, ActivityIndicator, ScrollView } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useUserStore } from '@/state/useUserStore'; // 유저 스토어
import CustomText from '@/components/common/CustomText'; // 커스텀 텍스트
import CustomButton from '@/components/common/CustomButton'; // 커스텀 버튼
import { deleteMarker, getMarkerDetails } from '@/api';
import { MarkerDetails } from '@/types';
import { colors, mapNavigations } from '@/constants';
import { MapStackParamList } from '@/navigations/stack/MapStackNavigator';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

const MarkerDetailScreen: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<MapStackParamList>>();
  const route = useRoute();
  const { markerId } = route.params as { markerId: string };
  const [markerDetails, setMarkerDetails] = useState<MarkerDetails | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const currentUserId = useUserStore((state) => state.userId);
  const { userData } = useUserStore((state) => state);

  useEffect(() => {
    fetchMarkerDetails(markerId);
  }, [markerId]);

  const BASE_IMAGE_URL = 'http://j11e106.p.ssafy.io:9000/images/';

  const fetchMarkerDetails = async (markerId: string) => {
    setLoading(true);
    setError(null);
    try {
      const markerDatas = await getMarkerDetails(markerId);
      const imageWithUrl = markerDatas.images.map((imageName) => BASE_IMAGE_URL + imageName);

      setMarkerDetails({ ...markerDatas, images: imageWithUrl });
    } catch (err) {
      setError('마커 디테일을 가져오는 데 실패');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    const status = await deleteMarker(markerId);

    if (status === 202) {
      setTimeout(() => {
        navigation.navigate(mapNavigations.HOME);
      }, 100);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    };
    return date.toLocaleString('ko-KR', options).replace(',', ''); // 한국어 형식 변환
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  if (error) {
    return <CustomText>{error}</CustomText>;
  }

  if (!markerDetails) {
    return null; // 마커 데이터가 없을 경우 null 반환
  }

  const nickname = userData.userId === markerDetails.userId ? userData.nickname : '익명';

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <CustomText style={styles.title}>{markerDetails.title}</CustomText>
      <CustomText style={styles.content}>{markerDetails.content}</CustomText>
      {markerDetails.images.length > 0 && (
        <View style={styles.imageContainer}>
          {markerDetails.images.map((imageUri, index) => (
            <Image key={index} source={{ uri: imageUri }} style={styles.image} />
          ))}
        </View>
      )}
      <View style={styles.userDateContainer}>
        <View style={styles.infoContainer}>
          <CustomText style={styles.userId}>작성자: {nickname}</CustomText>
          <CustomText style={styles.date}>{`${formatDate(
            markerDetails.createdAt,
          )}에 생성됨`}</CustomText>
        </View>
      </View>
      {/* 현재 접속한 유저와 작성자가 동일할 때만 삭제 버튼 렌더링 */}
      {currentUserId === markerDetails.userId && (
        <CustomButton label="삭제" onPress={handleDelete} variant="outlined"
        style={{ position: 'absolute', bottom: 90, left: 20, borderColor: `${colors.RED.BASE}` }}
        textStyle={{ color: `${colors.RED.BASE}` }}
        />
      )}
      <CustomButton label="뒤로 가기" onPress={() => navigation.goBack()} variant="outlined"
        style={{ position: 'absolute', bottom: 30, left: 20 }}
      />
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
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  image: {
    width: '100%',
    height: undefined,
    aspectRatio: 1.5,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ecf0f1',
    resizeMode: 'cover',
  },
  userId: {
    fontSize: 14,
    marginBottom: 20,
    color: '#7f8c8d',
  },
  userDateContainer: {
    flexDirection: 'column',
  },
  infoContainer: {
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
  },
});

export default MarkerDetailScreen;
