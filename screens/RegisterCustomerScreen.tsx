// screens/RegisterCustomerScreen.tsx

import React, { FC, useState, useEffect } from 'react';
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  Alert,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import InputField from '../components/InputField';
import PrimaryButton from '../components/PrimaryButton';
import SecondaryButton from '../components/SecondaryButton';
import { Role, User } from './types';
import { RootStackParamList } from '../navigation';

import styles from '../theme/styles';
import colors from '../theme/colors';
import metrics from '../theme/metrics';

type Props = NativeStackScreenProps<RootStackParamList, 'RegisterCustomer'>;
const API_BASE_URL = 'http://localhost:8000';

const RegisterCustomerScreen: FC<Props> = ({ navigation }) => {
  const [roles, setRoles] = useState<Role[]>([]);
  const [loadingRoles, setLoadingRoles] = useState<boolean>(true);
  const [phone, setPhone] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [location, setLocation] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  // Fetch available roles on mount
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/roles`);
        if (!res.ok) throw new Error(`Failed to load roles (${res.status})`);
        const data: Role[] = await res.json();
        setRoles(data);
      } catch (err: any) {
        Alert.alert('Error', err.message || 'Could not load roles');
      } finally {
        setLoadingRoles(false);
      }
    })();
  }, []);

  // Format "(123) 456-7890" as the user types
  const formatPhone = (input: string): string => {
    const digits = input.replace(/\D/g, '').slice(0, 10);
    if (digits.length === 0) return '';
    if (digits.length < 4) return `(${digits}`;
    if (digits.length < 7) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
  };

  // Update phone with formatting on each keystroke
  const handleChange = (text: string) => {
    setPhone(formatPhone(text));
  };

  // Submit registration
  const handleRegister = async () => {
    if (phone.replace(/\D/g, '').length !== 10) {
      return Alert.alert('Invalid Phone', 'Enter a valid 10-digit US number.');
    }
    if (!name.trim() || !location.trim()) {
      return Alert.alert('Missing Fields', 'Name and Location are required.');
    }
    const customerRole = roles.find(r => r.name.toLowerCase() === 'customer');
    if (!customerRole) {
      return Alert.alert(
        'Configuration Error',
        'Customer role not found on server.'
      );
    }

    setLoading(true);
    try {
      const digits = phone.replace(/\D/g, '');
      const payload = {
        phone_number: `+1${digits}`,
        name:         name.trim(),
        location:     location.trim(),
        email:        email.trim() || undefined,
        roles:        [customerRole.id],
      };

      const res = await fetch(`${API_BASE_URL}/users/register`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(payload),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.detail || res.statusText);
      }

      const saved: any = await res.json();
      const user: User = {
        id:          saved.id,
        phoneNumber: saved.phone_number,
        name:        saved.name,
        location:    saved.location,
        email:       saved.email,
        roles:       saved.roles,
      };

      await AsyncStorage.setItem('user', JSON.stringify(user));
      navigation.replace('Profile', { user });
    } catch (err: any) {
      Alert.alert('Registration Failed', err.message || 'Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Show loader until roles are fetched
  if (loadingRoles) {
    return (
      <SafeAreaView style={[styles.screen, localStyles.center]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.screen}>
      <ScrollView contentContainerStyle={localStyles.container}>
        <Text style={styles.title}>Register as Customer</Text>

        <InputField
          style={styles.input}
          placeholder="Phone Number"
          value={phone}
          onChangeText={handleChange}
          keyboardType="phone-pad"
          autoCapitalize="none"
        />

        <InputField
          style={styles.input}
          placeholder="Name"
          value={name}
          onChangeText={setName}
          autoCapitalize="words"
        />

        <InputField
          style={styles.input}
          placeholder="Location"
          value={location}
          onChangeText={setLocation}
          autoCapitalize="words"
        />

        <InputField
          style={styles.input}
          placeholder="Email (optional)"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        {loading ? (
          <ActivityIndicator style={localStyles.loader} color={colors.primary} />
        ) : (
          <PrimaryButton title="Register" onPress={handleRegister} />
        )}

        <View style={localStyles.backWrapper}>
          <SecondaryButton
            title="Back to Login"
            onPress={() => navigation.replace('Login')}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default RegisterCustomerScreen;

const localStyles = StyleSheet.create({
  container: {
    alignItems: 'center',
    padding: metrics.gutter,
  },
  loader: {
    marginTop: metrics.gutter,
  },
  backWrapper: {
    marginTop: metrics.gutter,
    width: '100%',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});