import React, { FC, useState, useEffect } from 'react';
import {
  SafeAreaView,
  Text,
  StyleSheet,
  Alert,
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

type Props = NativeStackScreenProps<RootStackParamList, 'Login'>;

// Change this per build (you could wire in dotenv or __DEV__ checks)
const API_BASE_URL = 'http://localhost:8000';

const LoginScreen: FC<Props> = ({ navigation }) => {
  const [phone, setPhone]     = useState('');
  const [loading, setLoading] = useState(false);

  // On mount: if we have a saved user, skip straight to profile
  useEffect(() => {
    (async () => {
      const json = await AsyncStorage.getItem('user');
      if (json) {
        try {
          const saved: User = JSON.parse(json);
          // verify with backend in case the user was deleted/changed
          const res = await fetch(`${API_BASE_URL}/users/${saved.id}`);
          if (res.ok) {
            const fresh: any = await res.json();
            // map snake_case → camelCase
            const user: User = {
              id:          fresh.id,
              phoneNumber: fresh.phone_number,
              name:        fresh.name,
              location:    fresh.location,
              email:       fresh.email,
            };
            return navigation.replace('Profile', { user });
          }
        } catch {
          // ignore and stay on login
        }
      }
    })();
  }, []);

  // helper to format "(123) 456-7890"
  const formatPhoneDisplay = (value: string) => {
    const digits = value.replace(/\D/g, '').slice(0, 10);
    if (digits.length < 4) return digits;
    if (digits.length < 7) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
  };

  const handleLogin = async () => {
    // validate 10 digits
    const digits = phone.replace(/\D/g, '');
    if (digits.length !== 10) {
      return Alert.alert('Invalid Phone', 'Enter a valid 10-digit US phone number.');
    }

    setLoading(true);
    try {
      const formattedPhone = `+1${digits}`;
      const res = await fetch(`${API_BASE_URL}/users/by-phone/${formattedPhone}`);
      if (res.status === 404) {
        return Alert.alert(
          'Not Registered',
          'This phone number is not registered. Please register first.'
        );
      }
      if (!res.ok) {
        throw new Error(`Server error ${res.status}`);
      }

      const fresh: any = await res.json();
      const user: User = {
        id:          fresh.id,
        phoneNumber: fresh.phone_number,
        name:        fresh.name,
        location:    fresh.location,
        email:       fresh.email,
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
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Welcome to Circuna</Text>

      <Card>
        <InputField
          placeholder="Phone Number"
          value={phone}
          onChangeText={text => setPhone(formatPhoneDisplay(text))}
          keyboardType="phone-pad"
        />

        {loading ? (
          <ActivityIndicator style={{ marginTop: 16 }} />
        ) : (
          <PrimaryButton title="Log In" onPress={handleLogin} />
        )}
      </Card>

      <SecondaryButton
        title="Register"
        onPress={() => navigation.navigate('Register')}
      />
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