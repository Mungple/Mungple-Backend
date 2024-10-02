import React, {ReactNode} from 'react'
import {
  Text,
  View,
  Pressable,
  StyleProp,
  ViewStyle,
  TextStyle,
  Dimensions,
  StyleSheet,
  PressableProps,
} from 'react-native'

import {colors} from '@/constants'

// 버튼 컴포넌트의 props 타입을 정의하는 인터페이스
interface CustomButtonProps extends PressableProps {
  label: string // 버튼에 표시할 텍스트
  icon?: ReactNode // 아이콘
  inValid?: boolean // 버튼이 유효하지 않을 때, 비활성화 여부 (기본값: false)

  size?: 'large' | 'medium' // 버튼 크기 정의 ('large' 또는 'medium', 기본값: 'large')
  variant?: 'filled' | 'outlined' // 버튼 스타일 정의 ('filled' 또는 'outlined', 기본값: 'filled')

  style?: StyleProp<ViewStyle> // 사용자 지정 스타일
  textStyle?: StyleProp<TextStyle> // 사용자 지정 텍스트 스타일
}

// 화면의 높이를 가져오는 상수, 조건부 스타일링에 사용
const deviceHeight = Dimensions.get('screen').height

const CustomButton = ({
  label,
  icon = null,
  inValid = false,

  size = 'large',
  variant = 'filled',

  style = null,
  textStyle = null,
  ...props
}: CustomButtonProps) => {
  return (
    <Pressable
      disabled={inValid}
      style={({pressed}) => [
        styles.container,
        pressed ? styles[`${variant}Pressed`] : styles[variant],
        inValid && styles.inValid,
        style,
      ]}
      {...props}>
      <View style={styles[size]}>
        {icon}
        <Text style={[styles.text, styles[`${variant}Text`], textStyle]}>{label}</Text>
      </View>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  inValid: {
    opacity: 0.5,
  },
  filled: {
    backgroundColor: colors.ORANGE.BASE,
    borderRadius: 8,
  },
  outlined: {
    borderColor: colors.ORANGE.BASE,
    borderWidth: 1,
    borderRadius: 8,
  },
  filledPressed: {
    backgroundColor: colors.ORANGE.DARKER,
    borderRadius: 8,
  },
  outlinedPressed: {
    borderColor: colors.ORANGE.BASE,
    borderWidth: 1,
    opacity: 0.5,
    borderRadius: 8,
  },
  large: {
    width: '100%',
    paddingVertical: deviceHeight > 700 ? 15 : 10,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    borderRadius: 8,
  },
  medium: {
    width: '50%',
    paddingVertical: deviceHeight > 700 ? 12 : 8,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    borderRadius: 8,
  },
  text: {
    fontSize: 16,
    fontWeight: '700',
  },
  filledText: {
    color: colors.WHITE,
  },
  outlinedText: {
    color: colors.ORANGE.BASE,
  },
})

export default CustomButton
