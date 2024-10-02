import {colors} from '@/constants'
import React from 'react'
import {StyleProp, ViewStyle} from 'react-native'
import styled from 'styled-components/native'

interface CustomCardProps {
  onPress?: () => void
  children?: React.ReactNode
  style?: StyleProp<ViewStyle>
}

const CustomCard: React.FC<CustomCardProps> = ({style, children, onPress}) => {
  return (
    <CardContainer style={style} onPress={onPress}>
      {children}
    </CardContainer>
  )
}

const CardContainer = styled.TouchableOpacity`
  background-color: ${colors.WHITE};
  border-radius: 16px;
  max-width: 600px;
  padding: 20px;
  width: 100%;
`

export default CustomCard
