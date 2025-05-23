// screens/LoginScreen.tsx

import React, { FC, useState, useEffect } from 'react';
import {
  SafeAreaView,
  Text,
  StyleSheet,
  Alert,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage     from '@react-native-async-storage/async-storage';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import { RootStackParamList } from '../navigation';
import InputField      from '../components/InputField';
import PrimaryButton   from '../components/PrimaryButton';
import SecondaryButton from '../components/SecondaryButton';
import { COLORS }      from '../constants/Colors';
import { User }        from './types';

type Props = NativeStackScreenProps<RootStackParamList, 'Login'>;
const API_BASE_URL = 'http://localhost:8000';

const LoginScreen: FC<Props> = ({ navigation }) => {
  const [phone, setPhone]     = useState('');
  const [loading, setLoading] = useState(false);

  // Auto-login if we've already saved a user
  useEffect(() => {
    (async () => {
      const json = await AsyncStorage.getItem('user');
      if (json) {
        const saved: User = JSON.parse(json);
        navigation.replace('Profile', { user: saved });
      }
    })();
  }, []);

  const formatPhone = (v: string) => {
    const d = v.replace(/\D/g, '').slice(0, 10);
    if (d.length < 4) return d;
    if (d.length < 7) return `(${d.slice(0, 3)}) ${d.slice(3)}`;
    return `(${d.slice(0, 3)}) ${d.slice(3, 6)}-${d.slice(6)}`;
  };

  const handleLogin = async () => {
    const digits = phone.replace(/\D/g, '');
    if (digits.length !== 10) {
      return Alert.alert('Invalid Phone', 'Enter a valid 10-digit US number.');
    }

    setLoading(true);
    try {
      const formatted = `+1${digits}`;
      const res = await fetch(`${API_BASE_URL}/users/by-phone/${formatted}`);
      if (res.status === 404) {
        return Alert.alert(
          'Not Registered',
          'This number isn’t in our system. Please register as a customer first.'
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
    <LinearGradient colors={['#E5F6F7', '#F7FAFA']} style={styles.gradient}>
      <SafeAreaView style={styles.container}>
        <Text style={styles.header}>Welcome to Circuna</Text>

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

          {loading
            ? <ActivityIndicator style={styles.loader} />
            : <PrimaryButton title="Log In" onPress={handleLogin} />
          }
        </LinearGradient>

        {/** Existing registration button now points to RegisterCustomer */}
        <SecondaryButton
          title="Register as Customer"
          onPress={() => navigation.navigate('RegisterCustomer')}
          style={styles.registerBtn}
          textStyle={styles.registerText}
        />
      </SafeAreaView>
    </LinearGradient>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  container: {
    flex:             1,
    alignItems:       'center',
    justifyContent:   'center',
    paddingHorizontal: 20,
  },
  header: {
    fontSize:       32,
    fontWeight:     Platform.select({ ios: '700', android: 'bold' }),
    color:          COLORS.navy,
    marginBottom:   40,
  },
  card: {
    width:           '100%',
    borderRadius:    30,
    padding:         30,
    shadowColor:     '#000',
    shadowOpacity:   0.05,
    shadowOffset:    { width: 0, height: 10 },
    shadowRadius:    20,
    elevation:       8,
    marginBottom:    20,
  },
  loader: {
    marginTop: 16,
  },
  registerBtn: {
    backgroundColor:   COLORS.coral,
    borderRadius:      24,
    paddingVertical:   16,
    paddingHorizontal: 32,
    marginTop:         20,
  },
  registerText: {
    fontSize:   18,
    fontWeight: 'bold',
    color:      COLORS.white,
  },
});