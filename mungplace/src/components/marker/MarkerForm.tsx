import React, { useState } from 'react';
import { View, TextInput, StyleSheet, Image } from 'react-native';
import CustomModal from '../common/CustomModal';
import { launchImageLibrary } from 'react-native-image-picker';
import { Picker } from '@react-native-picker/picker';
import CustomButton from '../common/CustomButton';
import LoadingSpinner from '../common/LoadingSpinner';
import { createMarker } from '@/api';
import { MarkerData } from '@/types';

type MarkerFormProps = {
  isVisible: boolean;
  onSubmit: (markerData: MarkerData) => void;
  onClose: () => void;
  latitude: number;
  longitude: number;
};

const MarkerForm: React.FC<MarkerFormProps> = ({
  isVisible,
  onSubmit,
  onClose,
  latitude,
  longitude,
}) => {
  const [body, setBody] = useState('');
  const [title, setTitle] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [type, setType] = useState<'BLUE' | 'RED'>('BLUE');
  const [imageUri, setImageUri] = useState<string | undefined>(undefined);

  const handleImagePick = () => {
    launchImageLibrary({ mediaType: 'photo' }, (response) => {
      if (!response.didCancel && !response.errorCode && response.assets) {
        setImageUri(response.assets[0].uri);
      }
    });
  };

  const handleSubmit = async () => {
    setIsLoading(true);

    const markerData: MarkerData = {
      markerId: Date.now().toString(),
      latitude,
      longitude,
      title,
      body,
      imageUri,
      type,
    };

    const formData = new FormData();

    // JSON 데이터
    const markerPayload = {
      lat: latitude,
      lon: longitude,
      title,
      content: body,
      explorationId: null,
      markerType: type,
    };

    // FormData에 JSON 데이터를 추가할 때 별도의 key 없이 추가
    formData.append('MarkerCreateRequest', JSON.stringify(markerPayload));

    // 이미지 파일을 FormData에 추가
    if (imageUri) {
      const imageFile = {
        uri: imageUri,
        name: imageUri.split('/').pop() || 'image.jpg',
        type: imageUri.endsWith('.png') ? 'image/png' : 'image/jpg',
      };
      formData.append('image', imageFile);
    }

    try {
      const data = await createMarker(formData);

      const createdMarker: MarkerData = {
        ...markerData,
        markerId: data.markerId,
      };

      onSubmit(createdMarker);
      onClose();
    } catch (error) {
      console.error('Error adding marker:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <CustomModal modalVisible={isVisible} setModalVisible={onClose}>
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
            multiline={true}
            numberOfLines={4}
          />
          {imageUri && <Image source={{ uri: imageUri }} style={styles.image} />}
          <CustomButton label="이미지 선택" onPress={handleImagePick} variant="outlined" />

          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={type}
              onValueChange={(itemValue) => setType(itemValue as 'BLUE' | 'RED')}
              style={styles.picker}>
              <Picker.Item label="블루 마커" value="BLUE" />
              <Picker.Item label="레드 마커" value="RED" />
            </Picker>
          </View>

          <CustomButton label="작성 완료" onPress={handleSubmit} variant="outlined" />
          <View style={{ marginTop: 10 }}>
            <CustomButton label="닫기" onPress={onClose} variant="outlined" />
          </View>
        </View>
      </View>
    </CustomModal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    width: '100%',
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  formContainer: {
    width: '100%', // 더 넓은 폭
    padding: 30, // 패딩 추가
    backgroundColor: '#f9f9f9', // 밝은 배경색
    borderRadius: 20, // 둥근 모서리
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  input: {
    width: '100%',
    padding: 10,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 15,
    borderRadius: 8, // 둥근 입력 필드
    backgroundColor: 'white', // 입력 필드 배경색
  },
  image: {
    width: '100%',
    height: 200, // 이미지 크기 키움
    marginVertical: 15,
    borderRadius: 10, // 둥근 모서리
  },
  pickerContainer: {
    width: '100%',
    marginVertical: 15,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 10,
    overflow: 'hidden',
  },
  picker: {
    width: '100%',
    backgroundColor: 'white',
  },
});

export default MarkerForm;
