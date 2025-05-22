// components/InputField.tsx

import React, { FC } from 'react';
import { TextInput, StyleSheet, TextInputProps } from 'react-native';
import { COLORS } from '../constants/Colors';

interface Props extends TextInputProps {
  placeholder: string;
  value:       string;
  onChangeText(text: string): void;
  // no change to defaults here
}

const InputField: FC<Props> = ({
  placeholder,
  value,
  onChangeText,
  keyboardType    = 'default',
  autoCapitalize  = 'sentences',   // ← back to React Native default
  ...rest
}) => (
  <TextInput
    style={styles.input}
    placeholder={placeholder}
    placeholderTextColor={COLORS.grey}
    value={value}
    onChangeText={onChangeText}
    keyboardType={keyboardType}
    autoCapitalize={autoCapitalize}
    {...rest}
  />
);

export default InputField;

const styles = StyleSheet.create({
  input: {
    backgroundColor: COLORS.white,
    borderRadius:    8,
    borderWidth:     1,
    borderColor:     COLORS.grey,
    padding:         12,
    marginBottom:    16,
    color:           COLORS.navy,
  },
});