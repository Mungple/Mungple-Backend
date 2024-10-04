import React from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import styled from 'styled-components/native';

import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RecordStackParamList } from '@/navigations/stack/RecordStackNavigator';

type WalkListScreenProps = NativeStackScreenProps<RecordStackParamList, 'WalkList'>;

const WalkListScreen: React.FC<WalkListScreenProps> = ({ navigation, route }) => {
  const { dayListData } = route.params;

  const renderDayWalks = ({
    item,
    index,
  }: {
    item: { distance: number; togetherDogIds: number[]; explorationId: number };
  }) => {
    return (
      <TouchableOpacity
        onPress={() => navigation.navigate('WalkDetail', { explorationId: item.explorationId })}>
        <ListItem>
          <NumberItem>{index}</NumberItem>
          <Text>산책 거리: {item.distance} km</Text>
          <FlatList
            data={item.togetherDogIds}
            renderItem={({ item }) => <Text>개 ID: {item}</Text>}
            keyExtractor={(dogId) => dogId.toString()}
          />
        </ListItem>
      </TouchableOpacity>
    );
  };

  return (
    <Container>
      <FlatList
        data={dayListData}
        renderItem={renderDayWalks}
        keyExtractor={(item) => item.explorationId.toString()}
      />
    </Container>
  );
};

const Container = styled.View`
  flex: 1;
  background-color: white;
`;

const NumberItem = styled.Text`
  flex: 1;
  font-weight: bold;
`;

const ListItem = styled.View`
  flexdirection: row;
  margin-bottom: 10px;
  padding: 10px;
  background-color: #f9f9f9;
  border-radius: 5px;
`;

export default WalkListScreen;
