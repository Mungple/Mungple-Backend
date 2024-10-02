import React, { useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import useMyMarkers from '@/hooks/useMyMarkers';
import { useNavigation } from '@react-navigation/native';
import { MapStackParamList } from '@/navigations/stack/MapStackNavigator';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { mapNavigations } from '@/constants';

const MyMar = () => {
  const { markers, fetchMyMarkers, loading } = useMyMarkers();
  const navigation = useNavigation<NativeStackNavigationProp<MapStackParamList>>()

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

  return (
    <View>
      <Text>내 마커 리스트</Text>
      <FlatList
        data={markers}
        keyExtractor={(item) => item.markerId}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => handleMarkerPress(item.markerId)}>
            <View>
              <Text>{item.title}</Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

export default MyMar;
