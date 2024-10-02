import {ViewStyle} from 'react-native'
import React, {createContext} from 'react'
import RadioButtonItem from './RadioButtonItem'
import styled from 'styled-components/native'

interface RadioButtonGroupProps {
  selected?: string
  children: React.ReactNode
  containerStyle?: ViewStyle
  onSelected?: (selected: string) => void
}

interface ContextProps {
  selected?: string
  onSelected: (selected: string) => void
}

// 라디오 버튼 아이템들이 그룹 내에서 선택된 값을 공유하고, 선택 상태를 변경할 수 있음
export const RadioGroupContext = createContext<ContextProps>({
  selected: undefined,
  onSelected: () => {},
})

const RadioButtonGroup = ({selected, children, onSelected = () => {}, containerStyle}: RadioButtonGroupProps) => {
  const {Provider} = RadioGroupContext

  return (
    <Provider value={{selected, onSelected}}>
      <RadioButtonGroupContainer style={containerStyle}>{children}</RadioButtonGroupContainer>
    </Provider>
  )
}

// RadioButtonItem을 하위 컴포넌트로 추가
RadioButtonGroup.RadioButtonItem = RadioButtonItem

export default RadioButtonGroup

const RadioButtonGroupContainer = styled.View`
  flex-direction: row;
  align-items: center;
  width: 100%;
`
