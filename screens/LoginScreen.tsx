// screens/LoginScreen.tsx

import React, { FC, useState } from 'react';
import {
  SafeAreaView,
  Text,
  StyleSheet,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation';
import InputField from '../components/InputField';
import PrimaryButton from '../components/PrimaryButton';
import Card from '../components/Card';
import { COLORS } from '../constants/Colors';
import { User } from './types';

type Props = NativeStackScreenProps<RootStackParamList, 'Login'>;

const LoginScreen: FC<Props> = ({ navigation }) => {
  const [phone, setPhone] = useState('');

  /**
   * Format a string of digits into "(123) 456-7890" style as the user types.
   */
  const formatPhoneDisplay = (value: string): string => {
    const digits = value.replace(/\D/g, '').slice(0, 10);
    const len = digits.length;

    if (len < 4) {
      return digits;
    } else if (len < 7) {
      return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
    } else {
      return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
    }
  };

  /**
   * Ensure exactly 10 digits for US phone numbers.
   */
  const validatePhone = (input: string): boolean => {
    const digits = input.replace(/\D/g, '');
    return digits.length === 10;
  };

  const handleLogin = async () => {
    if (!validatePhone(phone)) {
      Alert.alert(
        'Invalid Phone Number',
        'Please enter a valid 10-digit US phone number.',
        [{ text: 'OK' }],
        { cancelable: true }
      );
      return;
    }

    const digits = phone.replace(/\D/g, '');
    const formattedPhone = `+1${digits}`;

    const user: User = {
      phoneNumber: formattedPhone,
      name:        'John Doe',
      location:    'Denver, CO',
      email:       'john.doe@example.com',
    };

    try {
      await AsyncStorage.setItem('user', JSON.stringify(user));
    } catch (e) {
      console.warn('Failed to save user:', e);
    }

    navigation.replace('Profile', { user });
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Welcome to Circuna</Text>

      <Card>
        <InputField
          placeholder="Phone Number"
          value={phone}
          onChangeText={text => setPhone(formatPhoneDisplay(text))}
          keyboardType="phone-pad"
        />
        <PrimaryButton
          title="Log In"
          onPress={handleLogin}
        />
      </Card>
    </SafeAreaView>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex:            1,
    backgroundColor: COLORS.softWhite,
    alignItems:      'center',
    justifyContent:  'center',
    padding:         16,
  },
  title: {
    fontSize:     24,
    fontWeight:   'bold',
    color:        COLORS.navy,
    marginBottom: 24,
  },
});