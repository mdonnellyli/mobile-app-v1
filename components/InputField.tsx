import React, { FC } from 'react';
import { TextInput, StyleSheet } from 'react-native';
import { COLORS } from '../constants/Colors';

interface Props {
  placeholder:  string;
  value:        string;
  onChangeText(v: string): void;
  keyboardType?: 'default' | 'phone-pad' | 'email-address' | 'numeric';
}

const InputField: FC<Props> = ({
  placeholder,
  value,
  onChangeText,
  keyboardType = 'default',
}) => (
  <TextInput
    style={styles.input}
    placeholder={placeholder}
    placeholderTextColor={COLORS.grey}
    value={value}
    onChangeText={onChangeText}
    keyboardType={keyboardType}
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
