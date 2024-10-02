import React from 'react'
import {View, Pressable, StyleProp, ViewStyle, StyleSheet, PressableProps} from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons'

import {colors} from '@/constants'

interface CustomButtonProps extends PressableProps {
  iconName: string // 사용할 아이콘 이름
  children?: React.ReactNode
  inValid?: boolean // 버튼이 유효하지 않을 때 비활성화 여부 (기본값: false)
  style?: StyleProp<ViewStyle> // 사용자 지정 스타일
  iconSize?: number // 아이콘 크기 설정
  zIndex?: number // z-index 값
  top?: number // absolute 포지션의 top 값
  right?: number // absolute 포지션의 right 값
  bottom?: number // absolute 포지션의 bottom 값
  left?: number // absolute 포지션의 left 값
}

const CustomMapButton = ({
  iconName,
  children,
  inValid = false,
  style = null,
  iconSize = 40,
  zIndex = 2,
  top,
  right,
  bottom,
  left,
  ...props
}: CustomButtonProps) => {
  return (
    <Pressable
      disabled={inValid}
      style={({pressed}) => [
        styles.container,
        pressed ? styles.filledPressed : styles.filled,
        inValid && styles.inValid,
        style,
        {
          position: 'absolute',
          zIndex: zIndex,
          top: top,
          right: right,
          bottom: bottom,
          left: left,
        },
      ]}
      {...props}>
      <View style={styles.fixedSize}>
        <Icon name={iconName} size={iconSize} color={colors.BLACK} />
        {children}
      </View>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 50,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  inValid: {
    opacity: 0.5,
  },
  filled: {
    backgroundColor: colors.WHITE,
    borderRadius: 50,
  },
  filledPressed: {
    backgroundColor: colors.GRAY_100,
    borderRadius: 50,
  },
  fixedSize: {
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 5,
    margin: 5,
  },
})

export default CustomMapButton
