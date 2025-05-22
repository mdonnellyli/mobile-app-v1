// screens/RegisterScreen.tsx

import React, { FC, useState } from 'react';
import {
  SafeAreaView,
  Text,
  StyleSheet,
  Alert,
  View,
  ActivityIndicator,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import { RootStackParamList } from '../navigation';
import InputField      from '../components/InputField';
import PrimaryButton   from '../components/PrimaryButton';
import SecondaryButton from '../components/SecondaryButton';
import Card            from '../components/Card';
import { COLORS }      from '../constants/Colors';
import { User }        from './types';

type Props = NativeStackScreenProps<RootStackParamList, 'Register'>;

// Your FastAPI base URL (adjust for dev vs prod environments)
const API_BASE_URL = 'http://localhost:8000';

const RegisterScreen: FC<Props> = ({ navigation }) => {
  const [phone, setPhone]       = useState('');
  const [name, setName]         = useState('');
  const [location, setLocation] = useState('');
  const [email, setEmail]       = useState('');
  const [loading, setLoading]   = useState(false);

  /** Format "(123) 456-7890" as user types */
  const formatPhoneDisplay = (value: string): string => {
    const digits = value.replace(/\D/g, '').slice(0, 10);
    if (digits.length < 4) return digits;
    if (digits.length < 7) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
  };

  /** Ensure exactly 10 digits */
  const validatePhone = (input: string): boolean =>
    input.replace(/\D/g, '').length === 10;

  /** Simple email regex */
  const validateEmail = (input: string): boolean =>
    /^[a-z][A-Za-z0-9._%+-]*@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(input);

  const handleRegister = async () => {
    // Client-side validation
    if (!validatePhone(phone)) {
      Alert.alert('Invalid Phone', 'Enter a valid 10-digit US phone number.');
      return;
    }
    if (!name.trim()) {
      Alert.alert('Name Required', 'Please enter your name.');
      return;
    }
    if (!location.trim()) {
      Alert.alert('Location Required', 'Please enter your location.');
      return;
    }
    if (email && !validateEmail(email.trim())) {
      Alert.alert(
        'Invalid Email',
        'Email must start with a lowercase letter and be valid.'
      );
      return;
    }

    setLoading(true);
    const digits = phone.replace(/\D/g, '');
    const payload = {
      phone_number: `+1${digits}`,
      name:         name.trim(),
      location:     location.trim(),
      email:        email.trim() || undefined,
    };

    try {
      const res = await fetch(`${API_BASE_URL}/users/register`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(payload),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.detail || 'Registration failed');
      }

      const savedUser = await res.json();
      // Map API response to your front-end User type
      const user: User = {
        id:          savedUser.id,
        phoneNumber: savedUser.phone_number,
        name:        savedUser.name,
        location:    savedUser.location,
        email:       savedUser.email,
      };

      await AsyncStorage.setItem('user', JSON.stringify(user));
      navigation.replace('Profile', { user });
    } catch (err: any) {
      Alert.alert('Registration Failed', err.message || 'Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Register</Text>

      <Card>
        <InputField
          placeholder="Phone Number"
          value={phone}
          onChangeText={text => setPhone(formatPhoneDisplay(text))}
          keyboardType="phone-pad"
        />
        <InputField
          placeholder="Name"
          value={name}
          onChangeText={setName}
        />
        <InputField
          placeholder="Location"
          value={location}
          onChangeText={setLocation}
        />
        <InputField
          placeholder="Email (optional)"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"  
        />

        {loading ? (
          <ActivityIndicator style={{ marginTop: 16 }} />
        ) : (
          <PrimaryButton title="Register" onPress={handleRegister} />
        )}
      </Card>

      <View style={{ marginTop: 16 }}>
        <SecondaryButton
          title="Back to Login"
          onPress={() => navigation.replace('Login')}
        />
      </View>
    </SafeAreaView>
  );
};

export default RegisterScreen;

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