import React from 'react';
import {FlatList, StyleSheet} from 'react-native';

import * as PL from './PetListStyle';
import { useUserStore } from '@/state/useUserStore';

interface PetListProps {
  marginBlock?: number;
  selectedPets?: number[];
  children?: React.ReactNode;
  handlePetSelect: (dogId: number) => void;
}

const PetList: React.FC<PetListProps> = ({children, marginBlock = 0, handlePetSelect, selectedPets = []}) => {
  const petData = useUserStore(state => state.petData);

  return (
    <PL.Container marginBlock={marginBlock}>
      <FlatList
        style={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
        data={petData}
        renderItem={({item}) => (
          <PL.DogCard
            isSelected={selectedPets.includes(item.id)}
            onPress={() => handlePetSelect(item.id)}>
            <PL.ImageContainer />
            <PL.InfoContainer>
              <PL.DogName>{item.name}</PL.DogName>
              <PL.SecondaryInfo>마지막 산책일  {item.birth.slice(0,10)}</PL.SecondaryInfo>
            </PL.InfoContainer>
          </PL.DogCard>
        )}
        keyExtractor={(item) => String(item.id)}
      />
      {children}
    </PL.Container>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    width: '100%',
    marginVertical: 10,
  },
});

export default PetList;
