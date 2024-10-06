import React from 'react';
import styled from 'styled-components/native';
import { FlatList, Text, Image as RNImage } from 'react-native';

import { ResponsePetProfile } from '@/types';
import CustomCard from '../common/CustomCard';
import { useUserStore } from '@/state/useUserStore';
import DefaultImage from '@/assets/profile-image.png';
import { colors, settingNavigations } from '@/constants';
import { SettingStackParamList } from '@/navigations/stack/SettingStackNavigator';
import { NavigationProp } from '@react-navigation/native';
import usePet from '@/hooks/queries/usePet';

type PetListProps = {
  navigation?: NavigationProp<SettingStackParamList>;
  selectedPets?: number[];
  homeScreenPress?: (dogId: number) => void;
};

const PetList: React.FC<PetListProps> = ({ navigation, selectedPets = [], homeScreenPress }) => {
  const userId = useUserStore((state) => state.userId);
  const { useGetPet } = usePet();
  const { data } = useGetPet(userId);

  const renderItem = ({ item }: { item: ResponsePetProfile }) => {
    const isSelected = selectedPets.includes(item.id);
    const lastWalkDate = item.birth.slice(0, 10);
    const onPress = () => {
      if (homeScreenPress) {
        homeScreenPress(item.id);
      } else {
        if (navigation) {
          navigation.navigate(settingNavigations.PET_DETAIL, { petData: item });
        }
      }
    };

    return (
      <DogCard isSelected={isSelected} onPress={onPress}>
        <Image
          source={
            item.photo
              ? { uri: `http://j11e106.p.ssafy.io:9000/images/${item.photo}` }
              : DefaultImage
          }
        />
        <Context>
          <Title>{item.name}</Title>
          <Text>마지막 산책일 | {lastWalkDate}</Text>
        </Context>
      </DogCard>
    );
  };

  return (
    <List
      data={data}
      renderItem={renderItem}
      showsVerticalScrollIndicator={false}
      keyExtractor={(item) => String(item.id)}
      contentContainerStyle={{ paddingBottom: 10 }}
    />
  );
};

const List = styled.FlatList`
  flex: 1;
  width: 100%;
  padding: 20px;
` as unknown as typeof FlatList;

const DogCard = styled(CustomCard)<{ isSelected: boolean }>`
  padding: 13px 20px;
  align-items: center;
  margin-bottom: 10px;
  flex-direction: row;
  justify-content: space-around;
  border-width: ${({ isSelected }) => (isSelected ? 3 : 1)}px;
  border-color: ${({ isSelected }) => (isSelected ? colors.ORANGE.BASE : colors.GRAY_200)};
`;

const Image = styled(RNImage)`
  width: 70px;
  height: 70px;
  border-radius: 35px;
`;

const Context = styled.View`
  gap: 10px;
  flex-direction: column;
`;

const Title = styled.Text`
  font-size: 18px;
  font-weight: bold;
  color: ${colors.BLACK};
`;

export default React.memo(PetList);
