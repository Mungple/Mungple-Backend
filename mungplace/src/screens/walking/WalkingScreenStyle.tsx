import {Dimensions} from 'react-native';
import styled from 'styled-components/native';

import {colors} from '@/constants';
import CustomCard from '@/components/common/CustomCard';
import CustomButton from '@/components/common/CustomButton';

const bottomBlockWidth = Dimensions.get('window').width - 40;

const ModalTitle = styled.Text`
  font-size: 20px;
  font-weight: bold;
  margin-top: 10px;
  text-align: center;
`;

const ButtonContainer = styled.View`
  flex-direction: row;
  justify-content: center;
  margin-top: 20px;
  width: 100%;
`;

const ConfirmButton = styled(CustomButton)`
  margin-right: 20px;
  width: ${bottomBlockWidth / 2 - 30}px;
`;

const CancelButton = styled(CustomButton)`
  background-color: ${colors.GRAY_300};
  width: ${bottomBlockWidth / 2 - 30}px;
`;

const Container = styled.View`
  flex: 1;
`;

const BottomCard = styled(CustomCard)<{height: number; width: number}>`
  position: absolute;
  bottom: 0;
  height: ${({height}) => `${height}px`};
  width: ${({width}) => `${width}px`};
  margin-right: 20px;
  padding: 20px;
`;

const WalkingInfo = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  margin-bottom: 10px;
`;

const InfoRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
  width: 100%;
`;

const InfoBlock = styled.View`
  flex: 1;
  align-items: center;
`;

const InfoLabel = styled.Text`
  font-size: 18px;
`;

const InfoValue = styled.Text`
  font-size: 32px;
  font-weight: bold;
  color: ${colors.BLACK};
`;

export {
  ModalTitle,
  ButtonContainer,
  ConfirmButton,
  CancelButton,
  Container,
  BottomCard,
  WalkingInfo,
  InfoRow,
  InfoBlock,
  InfoLabel,
  InfoValue,
};
