import React, {useState} from 'react'
import {View, Button, TextInput, StyleSheet, Image} from 'react-native'
import CustomModal from '../common/CustomModal'
import {launchImageLibrary} from 'react-native-image-picker'
import {Picker} from '@react-native-picker/picker'
import {MarkerData} from '../../state/useMapStore'
import {useAppStore} from '@/state/useAppStore'
import axiosInstance from '@/api/axios'

export interface MarkerFormProps {
  isVisible: boolean
  onSubmit: (markerData: MarkerData) => void
  onClose: () => void
  latitude: number
  longitude: number
}

const MarkerForm: React.FC<MarkerFormProps> = ({isVisible, onSubmit, onClose, latitude, longitude}) => {
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [imageUri, setImageUri] = useState<string | undefined>(undefined)
  const [type, setType] = useState<'BLUE' | 'RED'>('BLUE')

  const accessToken = useAppStore(state => state.token)
  // console.log("토큰 :", accessToken)

  const handleImagePick = () => {
    launchImageLibrary({mediaType: 'photo'}, response => {
      if (!response.didCancel && !response.errorCode && response.assets) {
        setImageUri(response.assets[0].uri)
        const imageFileName = response.assets[0].fileName || 'image.jpg'
        setImageFileName(imageFileName)
      }
    })
  }

  const [imageFileName, setImageFileName] = useState('')

  const handleSubmit = async () => {
    const markerData: MarkerData = {
      markerId: Date.now().toString(),
      latitude,
      longitude,
      title,
      body,
      imageUri,
      type,
    }

    console.log('Marker Data:', markerData)

    const formData = new FormData()

    // JSON 데이터를 추가할 때 문자열로 처리
    const markerPayload = {
      lat: latitude,
      lon: longitude,
      title,
      content: body,
      explorationId: null, // 필요시 explorationId 추가
      markerType: type,
    }

    // FormData에 JSON 데이터를 추가할 때 별도의 key 없이 추가
    formData.append('MarkerCreateRequest', JSON.stringify(markerPayload))

    // 이미지 파일을 FormData에 추가
    if (imageUri) {
      const imageFile = {
        uri: imageUri,
        name: imageFileName,
        type: imageUri.endsWith('.png') ? 'image/png' : 'image/jpg', // 올바른 MIME 타입 설정
      }
      formData.append('image', imageFile)
    }

    try {
      // axios로 FormData 전송
      const response = await axiosInstance.post('/markers', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${accessToken}`,
        },
      })

      console.log('서버 응답:', response.data)
      console.log('마커 ID:', response.data.markerId)
      // 서버에서 응답받은 데이터로 마커 생성
      const createdMarker: MarkerData = {
        ...markerData,
        markerId: response.data.markerId, // 서버 응답에서 받은 ID로 설정
      }

      onSubmit(createdMarker)
      onClose()
      console.log('마커 데이터 입니다', createdMarker)
    } catch (error) {
      console.error('Error adding marker:', error)
      // 서버에서 반환한 에러 응답을 콘솔에 출력
    }
  }

  return (
    <CustomModal modalVisible={isVisible} setModalVisible={onClose}>
      <View>
        <View>
          <TextInput placeholder="제목을 입력하세요" value={title} onChangeText={setTitle} />
          <TextInput placeholder="내용을 입력하세요" value={body} onChangeText={setBody} />
          {imageUri && <Image source={{uri: imageUri}} />}
          <Button title="이미지 선택" onPress={handleImagePick} />

          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={type}
              onValueChange={itemValue => setType(itemValue as 'BLUE' | 'RED')}
              style={styles.picker}>
              <Picker.Item label="파랑" value="BLUE" />
              <Picker.Item label="빨강" value="RED" />
            </Picker>
          </View>

          <Button title="작성 완료" onPress={handleSubmit} />
          <Button title="닫기" onPress={onClose} />
        </View>
      </View>
    </CustomModal>
  )
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  formContainer: {
    width: '80%',
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderBottomWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  image: {
    width: 100,
    height: 100,
    marginVertical: 10,
  },
  pickerContainer: {
    marginVertical: 10,
  },
  picker: {
    height: 50,
    width: '100%',
  },
})

export default MarkerForm
