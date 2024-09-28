import React, {useCallback} from 'react';
import {FlatList, Text, Image as RNImage} from 'react-native';
import styled from 'styled-components/native';

import {colors} from '@/constants';
import {ResponsePetProfile} from '@/types';
import CustomCard from '../common/CustomCard';
import {useUserStore} from '@/state/useUserStore';
import DefaultImage from '@/assets/profile-image.png';

interface PetListProps {
  selectedPets?: number[];
  handlePetSelect: (dogId: number) => void;
}

const PetList: React.FC<PetListProps> = ({
  handlePetSelect,
  selectedPets = [],
}) => {
  const data = useUserStore(state => state.petData);

  const renderItem = useCallback(({item}: {item: ResponsePetProfile}) => {
      const isSelected = selectedPets.includes(item.id);
      const lastWalkDate = item.birth.slice(0, 10);

      return (
        <DogCard isSelected={isSelected} onPress={() => handlePetSelect(item.id)}>
          <Image source={item.photo ? {uri: item.photo} : DefaultImage} />
          <Context>
            <Title>{item.name}</Title>
            <Text>마지막 산책일 {lastWalkDate}</Text>
          </Context>
        </DogCard>
      );
    },
    [selectedPets, handlePetSelect],
  );

  return (
    <List
      data={data}
      renderItem={renderItem}
      showsVerticalScrollIndicator={false}
      keyExtractor={item => String(item.id)}
    />
  );
};

const List = styled.FlatList`
  flex: 1;
  width: 100%;
  padding: 20px;
` as unknown as typeof FlatList;

const DogCard = styled(CustomCard)<{isSelected: boolean}>`
  padding: 14px 20px;
  align-items: center;
  margin-bottom: 10px;
  flex-direction: row;
  justify-content: space-around;
  border-width: ${({isSelected}) => (isSelected ? 3 : 1)}px;
  border-color: ${({isSelected}) =>
    isSelected ? colors.ORANGE.BASE : colors.GRAY_200};
`;

const Image = styled(RNImage)`
  width: 70px;
  height: 70px;
  border-radius: 35px;
`;

const Context = styled.View`
  flex-direction: column;
`;

const Title = styled.Text`
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 8px;
  color: ${colors.BLACK};
`;

export default React.memo(PetList);
