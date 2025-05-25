// ~/code/github.com/circuna.com/mobile-app-v1/screens/LoginScreen.tsx

import React, { FC, useState, useEffect } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  Alert,
  ActivityIndicator,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import InputField from '../components/InputField';
import PrimaryButton from '../components/PrimaryButton';
import SecondaryButton from '../components/SecondaryButton';
import styles from '../theme/styles';
import colors from '../theme/colors';
import { RootStackParamList } from '../navigation';

type Props = NativeStackScreenProps<RootStackParamList, 'Login'>;
const API_BASE_URL = 'http://localhost:8000';

const LoginScreen: FC<Props> = ({ navigation }) => {
  const [phone, setPhone] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  // Auto-login if a user is stored
  useEffect(() => {
    (async () => {
      try {
        const json = await AsyncStorage.getItem('user');
        if (json) {
          const saved = JSON.parse(json);
          navigation.replace('Profile', { user: saved });
        }
      } catch {
        // ignore errors
      }
    })();
  }, []);

  // Format "(123) 456-7890" as you type
  const formatPhone = (input: string): string => {
    const digits = input.replace(/\D/g, '').slice(0, 10);
    if (digits.length === 0) return '';
    if (digits.length < 4) return `(${digits}`;
    if (digits.length < 7) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
  };

  // onChangeText: reformat every keystroke
  const handleChange = (text: string) => {
    setPhone(formatPhone(text));
  };

  // Perform login by phone number
  const handleLogin = async () => {
    const digits = phone.replace(/\D/g, '');
    if (digits.length !== 10) {
      return Alert.alert('Invalid Phone', 'Enter a valid 10-digit US number.');
    }

    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/users/by-phone/+1${digits}`);
      if (res.status === 404) {
        return Alert.alert(
          'Not Registered',
          'This number isn’t in our system. Please register as a customer first.'
        );
      }
      if (!res.ok) {
        throw new Error(`Server error ${res.status}`);
      }

      const fresh = await res.json();
      const user = {
        id:          fresh.id,
        phoneNumber: fresh.phone_number,
        name:        fresh.name,
        location:    fresh.location,
        email:       fresh.email,
        roles:       fresh.roles,
      };

      await AsyncStorage.setItem('user', JSON.stringify(user));
      navigation.replace('Profile', { user });
    } catch (err: any) {
      Alert.alert('Login Failed', err.message || 'Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.screen}>
      <Text style={styles.title}>Welcome to Circuna</Text>

      <View style={styles.card}>
        <InputField
          style={styles.input}
          placeholder="Phone Number"
          value={phone}
          onChangeText={handleChange}
          keyboardType="phone-pad"
          autoCapitalize="none"
        />

        {loading ? (
          <ActivityIndicator size="large" color={colors.primary} />
        ) : (
          <PrimaryButton title="Log In" onPress={handleLogin} />
        )}
      </View>

      <SecondaryButton
        title="Register as Customer"
        onPress={() => navigation.replace('RegisterCustomer')}
      />
    </SafeAreaView>
  );
};

export default LoginScreen;