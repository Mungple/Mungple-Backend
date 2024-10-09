import React, { useRef } from 'react';
import MapView, { Polyline, PROVIDER_GOOGLE } from 'react-native-maps';
import styled from 'styled-components/native';
import { colors } from '@/constants';
import CustomText from '@/components/common/CustomText';

interface Point {
  latitude: number;
  longitude: number;
}

interface WalkMapProps {
  points: Point[];
}

const WalkMap: React.FC<WalkMapProps> = ({ points }) => {
  console.log('WalkMap points:', points);
  const mapRef = useRef<MapView | null>(null);

  return (
    <Container>
      <StyledHeader>
        <CustomText fontWeight="bold" fontSize={18}>
          상세 정보
        </CustomText>
      </StyledHeader>
      <MapView
        ref={mapRef}
        provider={PROVIDER_GOOGLE}
        style={{ flex: 1 }}
        zoomEnabled={true}
        initialRegion={{
          latitude: points[0].latitude,
          longitude: points[0].longitude,
          latitudeDelta: 0.001, // 범위 조정
          longitudeDelta: 0.001, // 범위 조정
        }}
        minZoomLevel={16}
        maxZoomLevel={20}>
        <Polyline
          coordinates={points} // LatLng 타입의 points
          strokeColor={colors.ORANGE.LIGHTER}
          strokeWidth={5}
        />
      </MapView>
    </Container>
  );
};

const Container = styled.View`
  background-color: ${colors.WHITE};
  flex: 1;
`;

const StyledHeader = styled.View`
  padding-left: 20px;
  padding-top: 12px;
  padding-bottom: 12px;
  border-bottom-width: 1px;
  border-bottom-color: ${colors.GRAY_100};
`;

export default WalkMap;
