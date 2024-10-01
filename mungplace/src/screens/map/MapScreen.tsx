// screens/MapScreen.tsx
import React, {useState} from 'react'
import styled from 'styled-components/native'

import useUserLocation from '@/hooks/useUserLocation'
import MapComponent from '@/components/map/MapComponent'

const MapScreen = () => {
  const {userLocation} = useUserLocation()
  const [isFormVisible, setIsFormVisible] = useState(false)

  const handleFormClose = () => {
    setIsFormVisible(false)
  }

  return (
    <Container>
      {userLocation && (
        <MapComponent
          userLocation={userLocation}
          isFormVisible={isFormVisible}
          onFormClose={handleFormClose}
        />
      )}
    </Container>
  )
}

const Container = styled.SafeAreaView`
  flex: 1;
`

export default MapScreen
