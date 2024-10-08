import React, { useEffect } from 'react';
import {
  View,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import useMyMarkers from '@/hooks/useMyMarkers';
import { useNavigation } from '@react-navigation/native';
import { MapStackParamList } from '@/navigations/stack/MapStackNavigator';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { mapNavigations } from '@/constants';
import CustomText from '@/components/common/CustomText';

const MyMar = () => {
  const { myMarkers, fetchMyMarkers, loading } = useMyMarkers();
  const navigation = useNavigation<NativeStackNavigationProp<MapStackParamList>>();

  useEffect(() => {
    fetchMyMarkers(); // 페이지 로딩 시 내 마커 데이터를 불러옴
  }, []);

  // 각 마커를 클릭했을 때 상세 페이지로 이동하는 핸들러
  const handleMarkerPress = (markerId: string) => {
    navigation.navigate(mapNavigations.MARKERDETAIL, { markerId }); // 상세 정보 페이지로 이동
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const options = { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hour12: false }
    return date.toLocaleString('ko-KR', options).replace(',', '') // 한국어 형식 변환
  }

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
              <View style={{ marginTop: 5}}>
                <CustomText fontSize={10} color='gray'>{`${formatDate(item.createdAt)}`}</CustomText>
              </View>
            </View>
          </TouchableOpacity>
        )}
        contentContainerStyle={styles.listContainer}
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
