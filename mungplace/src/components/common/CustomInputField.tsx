import React, {ForwardedRef, ReactNode, forwardRef, useRef} from 'react';
import {Dimensions, StyleSheet, TextInput, View, TextInputProps, Text, Pressable} from 'react-native';

import {mergeRefs} from '@/utils';
import {colors} from '@/constants';

interface CustomInputFieldProps extends TextInputProps {
  disabled?: boolean;
  error?: string;
  touched?: boolean;
  icon?: ReactNode;
}

const deviceHeight = Dimensions.get('screen').height;

const CustomInputField = forwardRef(
  (
    {disabled = false, error, touched, icon = null, ...props}: CustomInputFieldProps,
    ref?: ForwardedRef<TextInput>,
  ) => {
    const innerRef = useRef<TextInput | null>(null);

    const handlePressInput = () => {
      innerRef.current?.focus();
    };

    return (
      <Pressable onPress={handlePressInput}>
        <View
          style={[
            styles.container,
            disabled && styles.disabled,
            props.multiline && styles.multiLine,
            touched && Boolean(error) && styles.inputError,
          ]}>
          <View style={Boolean(icon) && styles.innerContainer}>
            {icon}
            <TextInput
              ref={ref ? mergeRefs(innerRef, ref) : innerRef}
              editable={!disabled}
              placeholderTextColor={colors.BLUE.BASE}
              style={[styles.input, disabled && styles.disabled]}
              autoCapitalize="none"
              spellCheck={false}
              autoCorrect={false}
              {...props}
            />
          </View>
          {touched && Boolean(error) && (
            <Text style={styles.error}>{error}</Text>
          )}
        </View>
      </Pressable>
    );
  },
);

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderColor: colors.GRAY_200,
    padding: deviceHeight > 700 ? 15 : 10,
  },
  multiLine: {
    paddingBottom: deviceHeight > 700 ? 45 : 30,
  },
  input: {
    fontSize: 16,
    color: colors.BLACK,
    padding: 0,
  },
  innerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  disabled: {
    backgroundColor: colors.GRAY_200,
    color: colors.BLUE.LIGHTER,
  },
  inputError: {
    borderWidth: 1,
    borderColor: colors.RED.DARKER,
  },
  error: {
    color: colors.RED.DARKER,
    fontSize: 12,
    paddingTop: 5,
  },
});

export default CustomInputField;
