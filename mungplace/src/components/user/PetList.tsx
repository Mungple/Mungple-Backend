import React from 'react';
import {FlatList, StyleSheet} from 'react-native';

import * as PL from './PetListStyle';

interface PetListProps {
  marginBlock?: number;
  selectedPets?: number[];
  children?: React.ReactNode;
  handlePetSelect: (dogId: number) => void;
}

const petData = [
  {id: 1, name: '강아지 1', lastWalk: '2023-09-20'},
  {id: 2, name: '강아지 2', lastWalk: '2023-09-18'},
  {id: 3, name: '강아지 3', lastWalk: '2023-09-15'},
  {id: 4, name: '강아지 4', lastWalk: '2023-09-10'},
  {id: 5, name: '강아지 5', lastWalk: '2023-09-05'},
  {id: 6, name: '강아지 6', lastWalk: '2023-09-08'},
];

const PetList: React.FC<PetListProps> = ({
  children,
  marginBlock = 0,
  handlePetSelect,
  selectedPets = [],
}) => {
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
              <PL.SecondaryInfo>마지막 산책일 {item.lastWalk}</PL.SecondaryInfo>
            </PL.InfoContainer>
          </PL.DogCard>
        )}
        keyExtractor={item => String(item.id)}
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
