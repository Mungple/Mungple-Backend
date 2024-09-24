import styled from 'styled-components/native';
import {TouchableOpacity} from 'react-native';

import {colors} from '@/constants';
import CustomCard from '@/components/common/CustomCard';

const Container = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  padding: 20px;
`;

const ImageCard = styled(CustomCard)`
  flex: 2;
`;

const DogInfo = styled(CustomCard)`
  flex: 1;
  background-color: ${colors.BEIGE.LIGHTER};
  padding: 30px;
  flex-direction: row;
  align-items: center;
`;

const Col = styled.View`
  flex: 1;
`;

const Row = styled.View`
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: 20px;
`;

const HeaderText = styled.Text`
  font-size: 20px;
  color: ${colors.BLACK};
`;

const RightText = styled.Text`
  font-size: 20px;
  color: ${colors.BLACK};
`;

const RightTextBold = styled(RightText)`
  font-weight: bold;
  text-align: right;
`;

// Modal 부분

const HeaderContainer = styled.View`
  width: 100%;
  padding: 16px;
  position: relation;
  align-items: center;
  flex-direction: row;
  justify-content: center;
  border-bottom-width: 1px;
  border-bottom-color: ${colors.GRAY_300};
`;

const MenuText = styled.Text`
  font-size: 24px;
  font-weight: bold;
  text-align: center;
  color: ${colors.BLACK};
`;

const CloseButton = styled(TouchableOpacity)`
  position: absolute;
  right: 20px;
`;

export {
  Col,
  Row,
  DogInfo,
  MenuText,
  Container,
  ImageCard,
  RightText,
  HeaderText,
  CloseButton,
  RightTextBold,
  HeaderContainer,
};
