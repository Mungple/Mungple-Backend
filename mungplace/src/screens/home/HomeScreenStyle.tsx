import styled from 'styled-components/native';
import { ImageBackground, TouchableOpacity } from 'react-native';

import { colors } from '@/constants';
import CustomCard from '@/components/common/CustomCard';
import CustomButton from '@/components/common/CustomButton';

const Container = styled.SafeAreaView`
  flex: 1;
  justify-content: center;
  align-items: center;
  padding: 20px;
`;

const ImageCard = styled(CustomCard)`
  flex: 2;
  padding: 0;
`;

const Image = styled(ImageBackground)`
  width: 100%;
  height: 100%;
  overflow: hidden;
  border-radius: 16px;
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

const StartButton = styled(CustomButton)`
  margin: 20px;
`;

export { MenuText, Container, Image, ImageCard, StartButton, CloseButton, HeaderContainer };
