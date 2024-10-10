import React from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

import { colors } from '@/constants';

type CustomImageInputProps = {
  onChange: () => void;
};

const CustomImageInput: React.FC<CustomImageInputProps> = ({ onChange }) => {
  return (
    <Pressable
      style={({ pressed }) => [pressed && styles.imageInputPressed, styles.imageInput]}
      onPress={onChange}>
      <Ionicons name="camera-outline" size={25} color={colors.GRAY_400} />
      <Text style={styles.inputText}>사진 추가</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  imageInput: {
    borderWidth: 1.5,
    borderColor: colors.GRAY_400,
    height: 100,
    width: 100,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
  },
  imageInputPressed: {
    opacity: 0.5,
  },
  inputText: {
    fontSize: 16,
    color: colors.GRAY_400,
  },
});

export default CustomImageInput;
