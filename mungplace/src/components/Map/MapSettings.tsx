import React from 'react'
import {FlatList, TouchableOpacity} from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons' // 아이콘 라이브러리
import styled from 'styled-components/native'

interface ButtonItem {
  label: string
  onPress: () => void
}

const buttonData: ButtonItem[] = [
  {label: '블루존', onPress: () => console.log('블루존 버튼 클릭')},
  {label: '레드존', onPress: () => console.log('레드존 버튼 클릭')},
  {label: '멍플', onPress: () => console.log('멍플 버튼 클릭')},
  {label: '편의정보', onPress: () => console.log('편의정보 버튼 클릭')},
  {label: '내 블루존', onPress: () => console.log('내 블루존 버튼 클릭')},
  {label: '레드마커', onPress: () => console.log('레드마커 버튼 클릭')},
  {label: '공사장', onPress: () => console.log('공사장 버튼 클릭')},
  {label: '블루 마커', onPress: () => console.log('블루 마커 버튼 클릭')},
]

const CustomBottomSheetContent: React.FC = () => {
  const renderButtonItem = ({item}: {item: ButtonItem}) => (
    <>
      <Button onPress={item.onPress}>
        <Icon name="star-outline" size={24} color="black" />
      </Button>
      <ButtonLabel>{item.label}</ButtonLabel>
    </>
  )

  return (
    <ButtonContainer>
      <FlatList
        data={buttonData}
        renderItem={renderButtonItem}
        keyExtractor={item => item.label}
        numColumns={2} // 2개의 버튼을 한 행에 배치
        contentContainerStyle={{paddingBottom: 10}}
      />
    </ButtonContainer>
  )
}

const ButtonContainer = styled.View`
  padding: 10px;
`

const Button = styled(TouchableOpacity)`
  flex: 1;
  background-color: #f0f0f0;
  margin: 10px;
  padding: 20px;
  border-radius: 10px;
  align-items: center;
  justify-content: center;
`

const ButtonLabel = styled.Text`
  margin-top: 10px;
  font-size: 16px;
  font-weight: bold;
  color: black;
`

export default CustomBottomSheetContent
