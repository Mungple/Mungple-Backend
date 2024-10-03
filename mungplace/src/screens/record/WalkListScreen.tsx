import React from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import styled from 'styled-components/native';

import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RecordStackParamList } from '@/navigations/stack/RecordNavigator';
import CustomHeader from '@/components/common/CustomHeader';

type WalkListScreenProps = NativeStackScreenProps<RecordStackParamList, 'WalkList'>;

const WalkListScreen: React.FC<WalkListScreenProps> = ({ navigation, route }) => {
  const { dayListData } = route.params;

  const renderDayWalks = ({
    item,
  }: {
    item: { distance: number; togetherDogIds: number[]; explorationId: number };
  }) => {
    return (
      <TouchableOpacity
        onPress={() => navigation.navigate('WalkDetail', { explorationId: item.explorationId })}>
        <ListItem>
          <Text>산책 거리: {item.distance} km</Text>
          <FlatList
            data={item.togetherDogIds} // 철자 수정
            renderItem={({ item }) => <Text>개 ID: {item}</Text>}
            keyExtractor={(dogId) => dogId.toString()}
          />
        </ListItem>
      </TouchableOpacity>
    );
  };

  return (
    <Container>
      <CustomHeader title="일간 산책" />
      <FlatList
        data={dayListData} // dayListData를 FlatList의 데이터 소스로 사용
        renderItem={renderDayWalks}
        keyExtractor={(item) => item.explorationId.toString()} // 각 산책의 ID를 키로 사용
      />
    </Container>
  );
};

const Container = styled.View`
  width: 100%;
  background-color: white;
  border: 1px solid black;
`;

const ListItem = styled.View`
  margin-bottom: 10px;
  padding: 10px;
  background-color: #f9f9f9;
  border: 1px solid #ccc;
  border-radius: 5px;
`;

export default WalkListScreen;
