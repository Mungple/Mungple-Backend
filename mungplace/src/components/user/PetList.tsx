import React from 'react';
import styled from 'styled-components/native';
import { View, FlatList, Image as RNImage } from 'react-native';
import { NavigationProp } from '@react-navigation/native';
import { SettingStackParamList } from '@/navigations/stack/SettingStackNavigator';
import Ionicons from 'react-native-vector-icons/Ionicons';

import { ResponsePetProfile } from '@/types';
import CustomCard from '../common/CustomCard';
import CustomText from '../common/CustomText';
import { useUserStore } from '@/state/useUserStore';
import DefaultImage from '@/assets/profile-image.png';
import { colors, settingNavigations } from '@/constants';
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

  const renderItem = ({ item, index }: { item: ResponsePetProfile; index: number }) => {
    const isSelected = selectedPets.includes(item.id);
    const birthDate = item.birth.slice(0, 10);
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
      <View>
        {index === 0 && (
          <HighlightContainer>
            <Ionicons name="trophy" size={24} color={colors.BLUE.DARKER} />
            <CustomText
              fontSize={16}
              fontWeight="bold"
              color={colors.ORANGE.LIGHTER}
              style={{ marginLeft: 4, marginBottom: 4 }}>
              대표 반려견
            </CustomText>
          </HighlightContainer>
        )}
        <DogCard isSelected={isSelected} onPress={onPress} isDefalut={index === 0}>
          <Image
            source={
              item.photo
                ? { uri: `http://j11e106.p.ssafy.io:9000/images/${item.photo}` }
                : DefaultImage
            }
          />
          <Context>
            <CustomText fontWeight="bold" fontSize={18}>
              {item.name}
            </CustomText>
            <CustomText color={colors.GRAY_200}>생일 | {birthDate}</CustomText>
          </Context>
        </DogCard>
      </View>
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

const DogCard = styled(CustomCard)<{ isSelected: boolean; isDefalut: boolean }>`
  padding: 13px 20px;
  align-items: center;
  margin-bottom: 10px;
  flex-direction: row;
  justify-content: space-around;
  border-width: ${({ isSelected, isDefalut }) => (isSelected ? 3 : isDefalut ? 2 : 1)}px;
  border-color: ${({ isSelected, isDefalut }) =>
    isSelected ? colors.ORANGE.BASE : isDefalut ? colors.BLUE.DARKER : colors.GRAY_100};
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

const HighlightContainer = styled.View`
  flex-direction: row;
  padding: 6px;
`;

export default React.memo(PetList);
