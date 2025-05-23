// screens/RegisterCustomerScreen.tsx

import React, { FC, useState, useEffect } from 'react';
import {
  SafeAreaView,
  Text,
  StyleSheet,
  Alert,
  ScrollView,
  ActivityIndicator,
  Platform,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import InputField      from '../components/InputField';
import PrimaryButton   from '../components/PrimaryButton';
import SecondaryButton from '../components/SecondaryButton';
import { COLORS }      from '../constants/Colors';
import { Role, User }  from './types';
import { RootStackParamList } from '../navigation';

type Props = NativeStackScreenProps<RootStackParamList, 'RegisterCustomer'>;
const API_BASE_URL = 'http://localhost:8000';

const RegisterCustomerScreen: FC<Props> = ({ navigation }) => {
  const [roles, setRoles]               = useState<Role[]>([]);
  const [loadingRoles, setLoadingRoles] = useState(true);
  const [phone, setPhone]               = useState('');
  const [name, setName]                 = useState('');
  const [location, setLocation]         = useState('');
  const [email, setEmail]               = useState('');
  const [loading, setLoading]           = useState(false);

  // 1) Fetch available roles on mount
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

  // 2) Utility to format "(123) 456-7890"
  const formatPhone = (v: string) => {
    const d = v.replace(/\D/g, '').slice(0, 10);
    if (d.length < 4) return d;
    if (d.length < 7) return `(${d.slice(0, 3)}) ${d.slice(3)}`;
    return `(${d.slice(0, 3)}) ${d.slice(3, 6)}-${d.slice(6)}`;
  };

  // 3) Submit handler
  const handleRegister = async () => {
    // basic validation
    if (phone.replace(/\D/g, '').length !== 10) {
      return Alert.alert('Invalid Phone', 'Enter a valid 10-digit US number.');
    }
    if (!name.trim() || !location.trim()) {
      return Alert.alert('Missing Fields', 'Name and Location are required.');
    }
    // find the “customer” role
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
      const payload: any = {
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

  // 4) Show loader until roles arrive
  if (loadingRoles) {
    return (
      <SafeAreaView style={styles.center}>
        <ActivityIndicator size="large" />
      </SafeAreaView>
    );
  }

  // 5) Render form
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Register as Customer</Text>

      <InputField
        placeholder="Phone Number"
        value={phone}
        onChangeText={t => setPhone(formatPhone(t))}
        keyboardType="phone-pad"
        autoCapitalize="none"
      />
      <InputField
        placeholder="Name"
        value={name}
        onChangeText={setName}
        autoCapitalize="words"
      />
      <InputField
        placeholder="Location"
        value={location}
        onChangeText={setLocation}
        autoCapitalize="words"
      />
      <InputField
        placeholder="Email (optional)"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      {loading ? (
        <ActivityIndicator style={styles.loader} />
      ) : (
        <PrimaryButton title="Register" onPress={handleRegister} />
      )}

      <SecondaryButton
        title="Back to Login"
        onPress={() => navigation.replace('Login')}
        style={styles.backBtn}
      />
    </ScrollView>
  );
};

export default RegisterCustomerScreen;

const styles = StyleSheet.create({
  container: {
    padding:       20,
    alignItems:    'center',
  },
  header: {
    fontSize:     24,
    fontWeight:   Platform.select({ ios: '700', android: 'bold' }),
    color:        COLORS.navy,
    marginBottom: 20,
  },
  loader: {
    marginTop: 16,
  },
  backBtn: {
    marginTop:    20,
    width:        '70%',
  },
  center: {
    flex:           1,
    justifyContent: 'center',
    alignItems:     'center',
  },
});