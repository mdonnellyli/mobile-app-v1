import React, { FC, ReactNode } from 'react';
import { View, StyleSheet } from 'react-native';
import { COLORS } from '../constants/Colors';

interface Props { children: ReactNode; }

const Card: FC<Props> = ({ children }) => (
  <View style={styles.card}>{children}</View>
);

export default Card;

const styles = StyleSheet.create({
  card: {
    width:           '100%',
    backgroundColor: COLORS.lightGrey,
    borderRadius:    16,
    padding:         24,
    shadowColor:     '#000',
    shadowOpacity:   0.1,
    shadowOffset:    { width: 0, height: 2 },
    shadowRadius:    4,
  },
});
