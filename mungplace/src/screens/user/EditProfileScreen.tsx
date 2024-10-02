import React from 'react'
import {Alert} from 'react-native'
import styled from 'styled-components/native'

import {addImage} from '@/api'
import {colors} from '@/constants'
import {useNavigation} from '@react-navigation/native'
import ImagePicker from '@/components/common/ImagePicker'
import CustomButton from '@/components/common/CustomButton'

const EditProfileScreen = () => {
  const navigation = useNavigation()

  const handleSubmit = () => {
    navigation.goBack()
    Alert.alert('제출', '프로필이 성공적으로 업데이트되었습니다.')
  }

  return (
    <Container>
      <ImagePicker uploadFunction={addImage} />
      <SubmitButton label="완료" onPress={handleSubmit} />
    </Container>
  )
}

const Container = styled.SafeAreaView`
  flex: 1;
  padding: 20px;
  justify-content: center;
  background-color: ${colors.WHITE};
`

const SubmitButton = styled(CustomButton)`
  margin-top: 20px;
`

export default EditProfileScreen
