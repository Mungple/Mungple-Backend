import {colors} from '@/constants'
import React from 'react'
import {FlatList, TouchableOpacity} from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons' // 아이콘 라이브러리
import styled from 'styled-components/native'

interface ButtonItem {
  label: string
  onPress: () => void
}

const buttonData: ButtonItem[] = [
  {
    label: '블루존',
    onPress: () => {
      console.log('블루존 버튼 클릭')
    },
  },
  {
    label: '레드존',
    onPress: () => {
      console.log('레드존 버튼 클릭')
    },
  },
  {
    label: '멍플',
    onPress: () => {
      console.log('멍플 버튼 클릭')
    },
  },
  {
    label: '편의정보',
    onPress: () => {
      console.log('편의정보 버튼 클릭')
    },
  },
  {
    label: '내 블루존',
    onPress: () => {
      console.log('내 블루존 버튼 클릭')
    },
  },
  {
    label: '레드마커',
    onPress: () => {
      console.log('레드마커 버튼 클릭')
    },
  },
  {
    label: '공사장',
    onPress: () => {
      console.log('공사장 버튼 클릭')
    },
  },
  {
    label: '블루 마커',
    onPress: () => {
      console.log('블루 마커 버튼 클릭')
    },
  },
]

const CustomBottomSheetContent: React.FC = () => {
  const renderButtonItem = ({item}: {item: ButtonItem}) => (
    <ButtonContainer>
      <Button onPress={item.onPress}>
        <Icon name="star-outline" size={24} color="white" />
      </Button>
      <ButtonLabel>{item.label}</ButtonLabel>
    </ButtonContainer>
  )

  return (
    <List
      data={buttonData}
      renderItem={renderButtonItem}
      keyExtractor={item => item.label}
      numColumns={2}
      contentContainerStyle={{alignItems: 'center', paddingBottom: 40}}
    />
  )
}

const List = styled.FlatList`
  width: 100%;
` as unknown as typeof FlatList

const Button = styled(TouchableOpacity)`
  width: 70px;
  height: 70px;
  margin: 10px;
  padding: 10px;
  border-radius: 35px;
  align-items: center;
  justify-content: center;
  background-color: ${colors.GRAY_300};
`

const ButtonContainer = styled.View`
  margin: 0 30px 30px;
  align-items: center;
  flex-direction: column;
`

const ButtonLabel = styled.Text`
  margin-top: 5px;
  font-size: 16px;
  font-weight: bold;
  color: black;
`

export default CustomBottomSheetContent
