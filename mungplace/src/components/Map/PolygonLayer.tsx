// components/map/PolygonLayer.tsx
import React from 'react'
import {Polygon, Marker} from 'react-native-maps'
import geohash from 'ngeohash'
import mungPleMarker from '@/assets/mungPleMarker.png'
import {Image} from 'react-native'

interface MungPlace {
  latitude: number
  longitude: number
}

interface PolygonLayerProps {
  mungPlaces: MungPlace[]
}

const PolygonLayer: React.FC<PolygonLayerProps> = ({mungPlaces}) => (
  <>
    {mungPlaces.map(place => {
      const hash = geohash.encode(place.latitude, place.longitude, 6)
      const {latitude, longitude} = geohash.decode(hash)
      const delta = 0.001
      const coordinates = [
        {latitude: latitude - delta, longitude: longitude - delta},
        {latitude: latitude - delta, longitude: longitude + delta},
        {latitude: latitude + delta, longitude: longitude + delta},
        {latitude: latitude + delta, longitude: longitude - delta},
      ]

      return (
        <React.Fragment key={`${place.latitude}-${place.longitude}`}>
          <Polygon coordinates={coordinates} fillColor="rgba(255, 255, 0, 0.3)" strokeColor="rgba(255, 255, 0, 0.7)" />
          <Marker coordinate={{latitude, longitude}}>
            <Image source={mungPleMarker} style={{width: 30, height: 30}} />
          </Marker>
        </React.Fragment>
      )
    })}
  </>
)

export default PolygonLayer
