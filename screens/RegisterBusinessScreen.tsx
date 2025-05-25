// screens/RegisterBusinessScreen.tsx

import React, { FC, useState } from 'react';
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
import styles from '../theme/styles';
import colors from '../theme/colors';
import metrics from '../theme/metrics';
import { User } from './types';
import { RootStackParamList } from '../navigation';

type Props = NativeStackScreenProps<RootStackParamList, 'RegisterBusiness'>;
const API_BASE_URL = 'http://localhost:8000';

const RegisterBusinessScreen: FC<Props> = ({ navigation }) => {
  const [phone, setPhone] = useState('');
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [email, setEmail] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [rating, setRating] = useState('');
  const [loading, setLoading] = useState(false);

  const formatPhone = (value: string) => {
    const digits = value.replace(/\D/g, '').slice(0, 10);
    if (digits.length < 4) return digits;
    if (digits.length < 7) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
  };

  const handleRegister = async () => {
    if (phone.replace(/\D/g, '').length !== 10) {
      return Alert.alert('Invalid Phone', 'Enter a valid 10-digit US number.');
    }
    if (!name.trim() || !location.trim() || !businessName.trim()) {
      return Alert.alert(
        'Missing Info',
        'Name, Location, and Business Name are required.'
      );
    }

    setLoading(true);
    try {
      const digits = phone.replace(/\D/g, '');
      const payload = {
        phone_number: `+1${digits}`,
        name: name.trim(),
        location: location.trim(),
        email: email.trim() || undefined,
        roles: [],
        provider_profile: {
          business_name: businessName.trim(),
          rating: rating ? parseInt(rating, 10) : undefined,
        },
      };

      const res = await fetch(`${API_BASE_URL}/users/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.detail);
      }

      const saved = await res.json();
      const user: User = {
        id: saved.id,
        phoneNumber: saved.phone_number,
        name: saved.name,
        location: saved.location,
        email: saved.email,
        roles: saved.roles,
        provider_profile: saved.provider_profile,
      };
      await AsyncStorage.setItem('user', JSON.stringify(user));
      navigation.replace('Profile', { user });
    } catch (e: any) {
      Alert.alert('Registration Failed', e.message || 'Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.screen}>
      <ScrollView contentContainerStyle={localStyles.container}>
        <Text style={styles.title}>Register as Business</Text>

        {loading ? (
          <ActivityIndicator size="large" color={colors.primary} />
        ) : (
          <>
            <InputField
              style={styles.input}
              placeholder="Phone Number"
              value={phone}
              onChangeText={formatPhone}
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
            <InputField
              style={styles.input}
              placeholder="Business Name"
              value={businessName}
              onChangeText={setBusinessName}
              autoCapitalize="words"
            />
            <InputField
              style={styles.input}
              placeholder="Rating (1-5)"
              value={rating}
              onChangeText={setRating}
              keyboardType="numeric"
            />
            <PrimaryButton 
              title="Register" 
              onPress={handleRegister} 
            />
          </>
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

export default RegisterBusinessScreen;

const localStyles = StyleSheet.create({
  container: {
    alignItems: 'center',
    padding: metrics.gutter,
    width: '100%',
  },
  backWrapper: {
    marginTop: metrics.gutter,
    width: '100%',
  },
});