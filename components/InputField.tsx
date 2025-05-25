// components/InputField.tsx

import React, { FC } from 'react';
import { TextInput, StyleSheet, TextInputProps } from 'react-native';
import { COLORS } from '../constants/Colors';

interface Props extends TextInputProps {
  placeholder: string;
  value: string;
  onChangeText(text: string): void;
  style?: TextInputProps['style'];
}

const InputField: FC<Props> = ({
  style,
  placeholder,
  value,
  onChangeText,
  keyboardType = 'default',
  autoCapitalize = 'sentences',
  ...rest
}) => (
  <TextInput
    {...rest}
    placeholder={placeholder}
    placeholderTextColor={COLORS.grey}
    value={value}
    onChangeText={onChangeText}
    keyboardType={keyboardType}
    autoCapitalize={autoCapitalize}
    style={[localStyles.input, style]} // merge local defaults with any passed-in style
  />
);

export default InputField;

const localStyles = StyleSheet.create({
  input: {
    backgroundColor: COLORS.white,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.grey,
    paddingHorizontal: 12,
    paddingVertical: 12,
    marginBottom: 16,
    color: COLORS.navy,
    width: '100%', // ensure full-width input
  },
});
