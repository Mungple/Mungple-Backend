import styled from 'styled-components/native';
import { Dimensions, TouchableOpacity } from 'react-native';

import {colors} from '@/constants';
import CustomCard from '@/components/common/CustomCard';

const {height: windowHeight} = Dimensions.get('window');

const Container = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  padding: 20px;
`;

const ImageCard = styled(CustomCard).attrs({
  style: {
    borderWidth: 1,
  },
})`
  height: ${windowHeight * 0.42}px;
`;

const DogInfo = styled(CustomCard).attrs({})`
  backgroundcolor: ${colors.BEIGE.LIGHTER};
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

const HeaderContainer = styled.View`
  position: relative;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 16px;
  border-bottom-width: 1px;
  border-bottom-color: ${colors.GRAY_300};
`;

const MenuText = styled.Text`
  font-size: 24px;
  font-weight: bold;
  text-align: center;
  flex: 1;
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
