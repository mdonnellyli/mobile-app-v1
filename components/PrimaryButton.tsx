import React, { FC } from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { COLORS } from '../constants/Colors';

interface Props {
  title: string;
  onPress(): void;
}

const PrimaryButton: FC<Props> = ({ title, onPress }) => (
  <TouchableOpacity style={styles.btn} onPress={onPress}>
    <Text style={styles.txt}>{title}</Text>
  </TouchableOpacity>
);

export default PrimaryButton;

const styles = StyleSheet.create({
  btn: {
    backgroundColor: COLORS.turquoise,
    borderRadius:    24,
    paddingVertical: 14,
    alignItems:      'center',
  },
  txt: {
    color:      COLORS.white,
    fontWeight: 'bold',
    fontSize:   16,
  },
});
