import React from 'react';
import { FlatList } from 'react-native';
import styled from 'styled-components/native';
import CustomText from '../common/CustomText';
import DefaultImage from '@/assets/profile-image.png';
import { useUserStore } from '@/state/useUserStore';
import { ResponsePetProfile } from '@/types';
import { colors } from '@/constants';

interface WalkDogsProps {
  togetherDogIds: number[];
}

const WalkDogs: React.FC<WalkDogsProps> = ({ togetherDogIds }) => {
  const petData = useUserStore((state) => state.petData);

  const getPetImageSource = (pet: ResponsePetProfile) => {
    return pet?.photo
      ? { uri: `http://j11e106.p.ssafy.io:9000/images/${pet.photo}` }
      : DefaultImage;
  };

  return (
    <Container>
      <StyledHeader>
        <CustomText fontWeight="bold" fontSize={16}>
          함께 산책한 아이들
        </CustomText>
      </StyledHeader>
      <ListItem>
        {togetherDogIds.length > 0 ? (
          <FlatList
            data={togetherDogIds}
            renderItem={({ item }) => {
              const pet = petData.find((pet) => pet.id === item);
              const petName = pet?.name || '정보 없음';
              const imageSource = pet ? getPetImageSource(pet) : DefaultImage;
              return (
                <DogList>
                  <StyledImage source={imageSource} />
                  <CustomText fontWeight="bold" fontSize={18}>
                    {petName}
                  </CustomText>
                </DogList>
              );
            }}
            keyExtractor={(dogId) => dogId.toString()}
            horizontal={false}
            showsVerticalScrollIndicator={false}
          />
        ) : (
          <>
            <StyledImage source={DefaultImage} />
          </>
        )}
      </ListItem>
    </Container>
  );
};

const Container = styled.View`
  background-color: ${colors.WHITE};
`;

const StyledHeader = styled.View`
  padding-left: 20px;
  padding-top: 12px;
  padding-bottom: 12px;
  border-bottom-width: 1px;
  border-bottom-color: ${colors.GRAY_100};
`;

const ListItem = styled.View`
  flex-direction: row;
  align-items: center;
  padding: 10px;
`;

const DogList = styled.View`
  flex-direction: row;
  align-items: center;
  padding: 10px;
`;

const StyledImage = styled.Image`
  width: 60px;
  height: 60px;
  border-radius: 25px;
  margin-right: 10px;
`;

export default WalkDogs;
