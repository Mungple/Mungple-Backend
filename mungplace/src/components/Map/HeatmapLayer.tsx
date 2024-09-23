// components/map/HeatmapLayer.tsx
import React from 'react';
import { Heatmap } from 'react-native-maps';
import { Zone } from '@/state/useMapStore';

interface HeatmapLayerProps {
  zones: Zone[];
  radius?: number;
  opacity?: number;
}

const HeatmapLayer: React.FC<HeatmapLayerProps> = ({ zones, radius = 50, opacity = 0.6 }) => (
  <Heatmap
    points={zones.map(zone => ({
      latitude: zone.latitude,
      longitude: zone.longitude,
      weight: zone.weight || 1,
    }))}
    radius={radius}
    opacity={opacity}
  />
);

export default HeatmapLayer;
