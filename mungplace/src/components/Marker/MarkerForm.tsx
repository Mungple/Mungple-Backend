import React, { useState } from 'react';
import { View, Button, TextInput, Modal, StyleSheet, Image, Text} from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import { Picker } from '@react-native-picker/picker';
import { MarkerData } from '../../state/useMapStore'

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
  const [type, setType] = useState<'blue' | 'red'>('blue')

  const handleImagePick = () => {
    launchImageLibrary({ mediaType: 'photo' }, response => {
      if (!response.didCancel && !response.errorCode) {
        setImageUri(response.assets?.[0]?.uri);
      }
    });
  };

  const handleSubmit = () => {
    const markerData: MarkerData = {
      id: Date.now().toString(),
      latitude: latitude,
      longitude: longitude,
      title,
      body,
      imageUri,
      type,
    };

    onSubmit(markerData);
    onClose();
  };

  return (
    <Modal visible={isVisible} transparent={true} animationType="slide">
      <View style={styles.modalContainer}>
        <View style={styles.formContainer}>
          <TextInput
            style={styles.input}
            placeholder="Title"
            value={title}
            onChangeText={setTitle}
          />
          <TextInput
            style={styles.input}
            placeholder="Body"
            value={body}
            onChangeText={setBody}
          />
          {imageUri && <Image source={{ uri: imageUri }} style={styles.image} />}
          <Button title="Pick an Image" onPress={handleImagePick} />

          <Text style={styles.label}>마커 타입 선택:</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={type}
              onValueChange={(itemValue) => setType(itemValue as 'blue' | 'red')}
              style={styles.picker}
            >
              <Picker.Item label="Blue" value="blue" />
              <Picker.Item label="Red" value="red" />
            </Picker>
          </View>

          <Button title="Submit" onPress={handleSubmit} />
          <Button title="Close" onPress={onClose} />
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
  label: {
    marginTop: 10,
    fontSize: 16,
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
