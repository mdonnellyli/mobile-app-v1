import React, { FC, useState } from 'react';
import {
  SafeAreaView,
  Text,
  StyleSheet,
  Alert,
  View,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import { RootStackParamList } from '../navigation';
import InputField      from '../components/InputField';
import PrimaryButton   from '../components/PrimaryButton';
import SecondaryButton from '../components/SecondaryButton';
import { COLORS }      from '../constants/Colors';
import { User }        from './types';

type Props = NativeStackScreenProps<RootStackParamList, 'Register'>;
const API_BASE_URL = 'http://localhost:8000';

const RegisterScreen: FC<Props> = ({ navigation }) => {
  const [phone, setPhone]       = useState('');
  const [name, setName]         = useState('');
  const [location, setLocation] = useState('');
  const [email, setEmail]       = useState('');
  const [loading, setLoading]   = useState(false);

  const formatPhone = (v: string) => {
    const d = v.replace(/\D/g, '').slice(0, 10);
    if (d.length < 4) return d;
    if (d.length < 7) return `(${d.slice(0, 3)}) ${d.slice(3)}`;
    return `(${d.slice(0, 3)}) ${d.slice(3, 6)}-${d.slice(6)}`;
  };

  const validatePhone = (input: string) =>
    input.replace(/\D/g, '').length === 10;
  const validateEmail = (input: string) =>
    input === '' || /^[a-z][A-Za-z0-9._%+-]*@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(input);

  const handleRegister = async () => {
    if (!validatePhone(phone)) {
      return Alert.alert('Invalid Phone', 'Enter a valid 10-digit US number.');
    }
    if (!name.trim()) {
      return Alert.alert('Name Required', 'Please enter your name.');
    }
    if (!location.trim()) {
      return Alert.alert('Location Required', 'Please enter your location.');
    }
    if (!validateEmail(email.trim())) {
      return Alert.alert('Invalid Email', 'Must start with lowercase and be valid.');
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
        const err = await res.json();
        throw new Error(err.detail || res.statusText);
      }
      const saved = await res.json();
      const user: User = {
        id:          saved.id,
        phoneNumber: saved.phone_number,
        name:        saved.name,
        location:    saved.location,
        email:       saved.email,
      };
      await AsyncStorage.setItem('user', JSON.stringify(user));
      navigation.replace('Profile', { user });
    } catch (err: any) {
      Alert.alert('Registration Failed', err.message || 'Try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient colors={['#F7FAFA', '#E5F6F7']} style={styles.gradient}>
      <SafeAreaView style={styles.container}>
        <Text style={styles.header}>Create Account</Text>
        <LinearGradient
          colors={[COLORS.softWhite, COLORS.lightGrey]}
          style={styles.card}
        >
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

          {loading
            ? <ActivityIndicator style={styles.loader} />
            : <PrimaryButton title="Register" onPress={handleRegister} />
          }
        </LinearGradient>

        <SecondaryButton
          title="Back to Login"
          onPress={() => navigation.replace('Login')}
          style={styles.backBtn}
          textStyle={styles.backText}
        />
      </SafeAreaView>
    </LinearGradient>
  );
};

export default RegisterScreen;

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  container: {
    flex:             1,
    alignItems:       'center',
    paddingTop:       50,
    paddingHorizontal: 20,
  },
  header: {
    fontSize:       30,
    fontWeight:     Platform.select({ ios: '700', android: 'bold' }),
    color:          COLORS.navy,
    marginBottom:   30,
    textShadowColor: 'rgba(0,0,0,0.1)',
    textShadowOffset:{ width: 0, height: 2 },
    textShadowRadius:4,
  },
  card: {
    width:           '100%',
    borderRadius:    30,
    padding:         25,
    shadowColor:     '#000',
    shadowOpacity:   0.05,
    shadowOffset:    { width: 0, height: 10 },
    shadowRadius:    20,
    elevation:       6,
    marginBottom:    20,
  },
  loader: {
    marginTop: 16,
  },
  backBtn: {
    backgroundColor: COLORS.coral,
    borderRadius:    20,
    paddingVertical: 12,
    paddingHorizontal: 30,
  },
  backText: {
    fontSize:   16,
    fontWeight: 'bold',
    color:      COLORS.white,
  },
});