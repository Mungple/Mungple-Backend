import {colors} from '@/constants'
import React from 'react'
import {StatusBar} from 'react-native'
import styled from 'styled-components/native'

type CustomHeaderProps = {
  title: string
  children?: React.ReactNode
}

const CustomHeader: React.FC<CustomHeaderProps> = ({title, children}) => {
  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor={colors.WHITE} />
      <Header>
        <HeaderTitle>{title}</HeaderTitle>
        {children}
      </Header>
    </>
  )
}

export default CustomHeader

const Header = styled.SafeAreaView`
  width: 100%;
  padding: 20px;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  background-color: ${colors.WHITE};
`

const HeaderTitle = styled.Text`
  font-size: 24px;
  font-weight: bold;
  color: ${colors.BLACK};
`
