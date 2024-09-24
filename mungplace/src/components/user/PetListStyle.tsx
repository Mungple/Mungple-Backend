import styled from 'styled-components/native';

import {colors} from '@/constants';
import CustomCard from '@/components/common/CustomCard';

const Container = styled.View<{marginBlock: number}>`
  flex: 1;
  height: 100%;
  padding: 20px;
  align-items: center;
  margin-top: ${({marginBlock}) => marginBlock}px;
`;

const DogCard = styled(CustomCard)<{isSelected: boolean}>`
  margin: 0 0 10px;
  padding: 12px 20px;
  flex-direction: row;
  align-items: center;
  justify-content: space-around;
  border-width: ${({isSelected}) => isSelected ? 3 : 1}px;
  borderColor: ${({isSelected}) => isSelected ? colors.ORANGE.BASE : colors.GRAY_300};
`;

const ImageContainer = styled.View`
  width: 60px;
  height: 60px;
  border-radius: 30px;
  background-color: ${colors.GRAY_200};
`;

const InfoContainer = styled.View`
  flex-direction: column;
`;

const DogName = styled.Text`
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 8px;
  color: ${colors.BLACK};
`;

const SecondaryInfo = styled.Text`
  font-size: 14px;
  color: ${colors.GRAY_300};
`;

export {
  DogCard,
  DogName,
  InfoContainer,
  SecondaryInfo,
  ImageContainer,
  Container,
};
