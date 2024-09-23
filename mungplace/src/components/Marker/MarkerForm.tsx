import React, { useState } from 'react';
import { View, Button, TextInput, Modal, StyleSheet, Image } from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import { Picker } from '@react-native-picker/picker';
import axios from 'axios';
import { MarkerData } from '../../state/useMapStore';
import { getAccessToken } from '@/api/auth';

export interface MarkerFormProps {
  isVisible: boolean;
  onSubmit: (markerData: MarkerData) => void;
  onClose: () => void;
  latitude: number;
  longitude: number;
}

const MarkerForm: React.FC<MarkerFormProps> = ({ isVisible, onSubmit, onClose, latitude, longitude }) => {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [imageUri, setImageUri] = useState<string | undefined>(undefined);
  const [type, setType] = useState<'blue' | 'red'>('blue');

  const handleImagePick = () => {
    launchImageLibrary({ mediaType: 'photo' }, response => {
      if (!response.didCancel && !response.errorCode && response.assets ) {
        setImageUri(response.assets[0].uri);
        const imageFileName = response.assets[0].fileName || 'image.jpg';
        setImageFileName(imageFileName)
      }
    });
  };

  const [imageFileName, setImageFileName] = useState('')

  const handleSubmit = async () => {
    console.log('제출 함수 불러오기 ')

    const markerData: MarkerData = {
      id: Date.now().toString(), // 임시 ID, 서버에서 받아오는 ID로 교체 필요
      latitude,
      longitude,
      title,
      body,
      imageUri,
      type,
    };

    console.log('Marker Data:', markerData);

    const formData = new FormData();
    const imageFile = imageUri ? { uri: imageUri, name: imageFileName, type: imageUri.endsWith('.png') ? 'image/png' : 'image/jpeg' } : undefined;

    const markerPayload = {
      lat: latitude,
      lon: longitude,
      title,
      content: body,
      explorationId: null, // 필요시 explorationId 추가
      markerType: type.toUpperCase(),
    };

    formData.append('MarkerCreateRequest', JSON.stringify(markerPayload));

    if (imageFile) {
      formData.append('image', imageFile);
    }

    try {
      const accessToken = await getAccessToken()
            
      const response = await axios.post('/markers', formData, {
        headers : {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${accessToken}` 
        },
      })
      // 서버에서 받아온 ID로 업데이트
      console.log("Response from server:", response.data);
      const createdMarker: MarkerData = {
        ...markerData,
        id: response.data.id, // 서버 응답에서 ID 가져오기
      };

      onSubmit(createdMarker); // 부모 컴포넌트에 마커 데이터 전달
      onClose();
    } catch (error) {
      console.error('Error adding marker:', error);
      // 오류 처리 추가
    }
  };

  return (
    <Modal visible={isVisible} transparent={true} animationType="slide">
      <View style={styles.modalContainer}>
        <View style={styles.formContainer}>
          <TextInput
            style={styles.input}
            placeholder="제목을 입력하세요"
            value={title}
            onChangeText={setTitle}
          />
          <TextInput
            style={styles.input}
            placeholder="내용을 입력하세요"
            value={body}
            onChangeText={setBody}
          />
          {imageUri && <Image source={{ uri: imageUri }} style={styles.image} />}
          <Button title="이미지 선택" onPress={handleImagePick} />

          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={type}
              onValueChange={(itemValue) => setType(itemValue as 'blue' | 'red')}
              style={styles.picker}
            >
              <Picker.Item label="파랑" value="blue" />
              <Picker.Item label="빨강" value="red" />
            </Picker>
          </View>

          <Button title="작성 완료" onPress={handleSubmit} />
          <Button title="닫기" onPress={onClose} />
        </View>
      </View>
    </Modal>
  );
};

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
});

export default MarkerForm;
