import React, { useState } from 'react';
import { View, Button, TextInput, Modal, StyleSheet, Image } from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';

export interface MarkerData {
  id: string;
  latitude: number;
  longitude: number;
  title: string;
  body: string;
  imageUri?: string;
}

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
    };

    onSubmit(markerData);
    onClose();
  };

  return (
    <Modal visible={isVisible} transparent={true} animationType="slide"> {/* isVisible로 수정 */}
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
});

export default MarkerForm;
