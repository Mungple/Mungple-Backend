import React from 'react';
import { FlatList, TouchableOpacity } from 'react-native';
import styled from 'styled-components/native';

import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RecordStackParamList } from '@/navigations/stack/RecordStackNavigator';
import { ResponsePetProfile } from '@/types';
import { useUserStore } from '@/state/useUserStore';
import { calculateDistance } from '@/utils/recordCalculator';
import DefaultImage from '@/assets/profile-image.png';
import { colors } from '@/constants';

type WalkListScreenProps = NativeStackScreenProps<RecordStackParamList, 'WalkList'>;

const WalkListScreen: React.FC<WalkListScreenProps> = ({ navigation, route }) => {
  const { dayListData } = route.params;
  const petData = useUserStore((state) => state.petData);

  const processPetPhoto = (petData: ResponsePetProfile[], dogId: number) => {
    const pet = petData.find((pet) => pet.id === dogId);
    return pet?.photo ? { uri: `http://j11e106.p.ssafy.io:9000/images/${pet.photo}` } : null;
  };

  const renderDayWalks = ({
    item,
    index,
  }: {
    item: { distance: number; togetherDogIds: number[]; explorationId: number };
    index: number;
  }) => {
    const { distance, togetherDogIds, explorationId } = item;

    return (
      <TouchableOpacity
        onPress={() => navigation.navigate('WalkDetail', { explorationId: explorationId })}>
        <ListItem>
          <NumContainer>
            <TextItem>{index + 1}</TextItem>
          </NumContainer>
          <DogList>
            {togetherDogIds.length > 0 ? (
              <FlatList
                data={togetherDogIds}
                renderItem={({ item }) => {
                  const imageSource = processPetPhoto(petData, item) || DefaultImage;
                  return (
                    <StyledImage
                      source={imageSource}
                      style={{ width: 50, height: 50, borderRadius: 25, marginRight: 5 }}
                    />
                  );
                }}
                keyExtractor={(dogId) => dogId.toString()}
                horizontal={true}
                showsHorizontalScrollIndicator={false}
              />
            ) : (
              <StyledImage
                source={DefaultImage}
                style={{ width: 50, height: 50, borderRadius: 25, marginRight: 5 }}
              />
            )}
          </DogList>
          <DistaneContainer>
            <TextItem>{calculateDistance(distance)}</TextItem>
          </DistaneContainer>
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

const Container = styled.SafeAreaView`
  flex: 1;
  background-color: ${colors.WHITE};
  padding-vertical: 10px;
`;

const NumContainer = styled.View`
  flex: 1;
  padding: 10px;
`;

const DistaneContainer = styled.View`
  flex: 3;
  font-weight: bold;
  padding: 10px;
  align-items: center;
`;

const TextItem = styled.Text`
  font-size: 24px;
  font-weight: bold;
`;

const ListItem = styled.View`
  flex-direction: row;
  margin-bottom: 10px;
  padding: 10px;
  align-items: center;
  border-bottom-width: 1px;
  border-bottom-color: ${colors.GRAY_100};
`;

const DogList = styled.View`
  flex: 5;
  flex-direction: row;
  align-items: center;
`;

const StyledImage = styled.Image`
  width: 50px;
  height: 50px;
  border-radius: 25px;
  margin-right: 5px;
`;

export default WalkListScreen;
