import React, { useState, useEffect } from 'react';
import { View, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { MapStackParamList } from '@/navigations/stack/MapStackNavigator';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { mapNavigations } from '@/constants';
import CustomText from '@/components/common/CustomText';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import { getMyMarkers } from '@/api';
import { MyMarkerData } from '@/types';
import CustomButton from '@/components/common/CustomButton';

const MyMar: React.FC = () => {
  const [loading, setLoading] = useState(true)
  const navigation = useNavigation<NativeStackNavigationProp<MapStackParamList>>();
  const [ myMarkers, setMyMarkers ] = useState<MyMarkerData[]>([])

  const fetchMyMarkers = async () => {
    try {
      const cursorId = myMarkers.length > 0 ? myMarkers[myMarkers.length -1].markerId : null
      const data = await getMyMarkers(cursorId)

      setMyMarkers((prevMarkers) => [
        ...prevMarkers, ...(Array.isArray(data) ? data : [data]),
      ])
    } catch (error) {
      console.error('내 마커 조회 실패', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchMyMarkers()
  }, [])

  if (loading) {
    return <LoadingSpinner/>; // 로딩 중 상태 표시
  }

  // 각 마커를 클릭했을 때 상세 페이지로 이동하는 핸들러
  const handleMarkerPress = (markerId: string) => {
    navigation.navigate(mapNavigations.MARKERDETAIL, { markerId }); // 상세 정보 페이지로 이동
  };

  if (loading) {
    return <LoadingSpinner />;
  }

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

  return (
    <View style={styles.container}>
      <FlatList
        data={myMarkers}
        keyExtractor={(item) => item.markerId}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => handleMarkerPress(item.markerId)}
            style={styles.markerItem}>
            <View>
              <CustomText fontSize={18}>{item.title}</CustomText>
              <View style={{ marginTop: 5 }}>
                <CustomText fontSize={10} color="gray">{`${formatDate(
                  item.createdAt,
                )}`}</CustomText>
              </View>
            </View>
          </TouchableOpacity>
        )}
        contentContainerStyle={styles.listContainer}
      />
      <CustomButton label="뒤로 가기" onPress={() => navigation.goBack()} variant="outlined" 
        style={{ position: 'absolute', bottom: 30, left: 20 }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f9f9f9',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
  },
  listContainer: {
    paddingBottom: 16,
  },
  markerItem: {
    backgroundColor: '#eaeaea',
    padding: 16,
    borderRadius: 8,
    marginVertical: 8,
    elevation: 1, // 안드로이드 그림자 효과
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
  },
  markerTitle: {
    fontSize: 18,
  },
});

export default MyMar;
