import { colors } from '@/constants';
import React from 'react';
import styled from 'styled-components/native';
import Icon from 'react-native-vector-icons/Ionicons';
import { FlatList, TouchableOpacity } from 'react-native';
import CustomText from '../common/CustomText';

interface ButtonItem {
  label: string;
  iconName: string;
  elementKey: keyof {
    blueZone: boolean;
    redZone: boolean;
    mungZone: boolean;
    convenienceInfo: boolean;
    myBlueZone: boolean;
    redMarkers: boolean;
    blueMarkers: boolean;
  };
}

interface VisibleElements {
  blueZone: boolean;
  redZone: boolean;
  mungZone: boolean;
  convenienceInfo: boolean;
  myBlueZone: boolean;
  redMarkers: boolean;
  blueMarkers: boolean;
}

interface MapSettingProps {
  visibleElements: VisibleElements;
  toggleElementVisibility: (element: keyof VisibleElements) => void;
}

const buttonData: ButtonItem[] = [
  {
    label: '블루존',
    iconName: 'locate-outline',
    elementKey: 'blueZone',
  },
  {
    label: '레드존',
    iconName: 'locate-outline',
    elementKey: 'redZone',
  },
  {
    label: '블루 마커',
    iconName: 'location-outline',
    elementKey: 'blueMarkers',
  },
  {
    label: '레드마커',
    iconName: 'location-outline',
    elementKey: 'redMarkers',
  },
  {
    label: '멍플',
    iconName: 'people-outline',
    elementKey: 'mungZone',
  },
  {
    label: '편의정보',
    iconName: 'information-circle-outline',
    elementKey: 'convenienceInfo',
  },
  {
    label: '내 블루존',
    iconName: 'home-outline',
    elementKey: 'myBlueZone',
  },
];

const MapSettings: React.FC<MapSettingProps> = ({ visibleElements, toggleElementVisibility }) => {
  const renderButtonItem = ({ item }: { item: ButtonItem }) => {
    const isSelected = visibleElements[item.elementKey];

    let zoneType: string;
    switch (item.elementKey) {
      case 'blueMarkers':
      case 'blueZone':
      case 'myBlueZone':
        zoneType = 'BLUE'
        break
      case 'redMarkers':
      case 'redZone':
        zoneType = 'RED'
        break
      default:
        zoneType = 'default'
    }

    return (
      <ButtonContainer>
        <Button 
          onPress={() => toggleElementVisibility(item.elementKey)} 
          selected={isSelected}
          zoneType={zoneType}
          >
          <Icon name={item.iconName} size={28} color={colors.WHITE} />
        </Button>
        <ButtonLabel>
          <CustomText fontSize={20}>
            {item.label}
          </CustomText>
        </ButtonLabel>
      </ButtonContainer>
    );
  };

  return (
    <List
      data={buttonData}
      renderItem={renderButtonItem}
      keyExtractor={(item) => item.label}
      numColumns={2}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ alignItems: 'center', paddingBottom: 40 }}
    />
  );
};

const List = styled.FlatList`
  width: 100%;
` as unknown as typeof FlatList;

const Button = styled(TouchableOpacity)<{ selected: boolean }>`
  width: 70px;
  height: 70px;
  margin: 10px;
  padding: 10px;
  border-radius: 35px;
  align-items: center;
  justify-content: center;
  background-color: ${({ selected, zoneType }) => {
    if (selected) {
      // zoneType에 따라 색상 변경
      return zoneType === 'BLUE'
        ? colors.BLUE.DARKER
        : zoneType === 'RED'
        ? colors.RED.BASE
        : colors.ORANGE.BASE;
    }
    return colors.GRAY_300;
  }};
`;

const ButtonContainer = styled.View`
  margin: 0 30px 30px;
  align-items: center;
  flex-direction: column;
`;

const ButtonLabel = styled.Text`
  margin-top: 5px;
  font-size: 16px;
  font-weight: bold;
  color: black;
`;

export default MapSettings;
