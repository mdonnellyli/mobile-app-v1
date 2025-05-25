// ~/code/github.com/circuna.com/mobile-app-v1/screens/ProfileScreen.tsx

import React, { FC, useEffect, useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  ActivityIndicator,
  Alert,
  StyleSheet,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import { RootStackParamList } from '../navigation';
import { User } from './types';
import SecondaryButton from '../components/SecondaryButton';

import styles from '../theme/styles';
import colors from '../theme/colors';
import metrics from '../theme/metrics';

type Props = NativeStackScreenProps<RootStackParamList, 'Profile'>;
const API_BASE_URL = 'http://localhost:8000';

const ProfileScreen: FC<Props> = ({ route, navigation }) => {
  const initial: User = route.params.user;
  const [user, setUser] = useState<User | null>(initial);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const res = await fetch(`${API_BASE_URL}/users/${initial.id}`);
        if (res.ok) {
          const data: any = await res.json();
          const updated: User = {
            id: data.id,
            phoneNumber: data.phone_number,
            name: data.name,
            location: data.location,
            email: data.email,
            roles: data.roles,
            client_profile: data.client_profile,
            provider_profile: data.provider_profile,
          };
          setUser(updated);
          await AsyncStorage.setItem('user', JSON.stringify(updated));
        }
      } catch (e) {
        // ignore fetch errors
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleLogout = () => {
    Alert.alert(
      'Confirm Log Out',
      'Are you sure you want to log out?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Log Out',
          style: 'destructive',
          onPress: async () => {
            await AsyncStorage.removeItem('user');
            navigation.replace('Login');
          },
        },
      ]
    );
  };

  if (loading || !user) {
    return (
      <View style={[styles.screen, { justifyContent: 'center', alignItems: 'center' }]}> 
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.screen}>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <Text style={styles.title}>Your Profile</Text>

        <View style={styles.card}>
          <View style={localStyles.row}>
            <Text style={localStyles.label}>Phone:</Text>
            <Text style={localStyles.value}>{user.phoneNumber}</Text>
          </View>

          <View style={localStyles.row}>
            <Text style={localStyles.label}>Name:</Text>
            <Text style={localStyles.value}>{user.name}</Text>
          </View>

          <View style={localStyles.row}>
            <Text style={localStyles.label}>Location:</Text>
            <Text style={localStyles.value}>{user.location}</Text>
          </View>

          <View style={localStyles.row}>
            <Text style={localStyles.label}>Email:</Text>
            <Text style={localStyles.value}>{user.email ?? 'N/A'}</Text>
          </View>

          <View style={localStyles.row}>
            <Text style={localStyles.label}>Roles:</Text>
            <Text style={localStyles.value}>{user.roles.map(r => r.name).join(', ')}</Text>
          </View>

          {user.provider_profile && (
            <View style={localStyles.section}>
              <Text style={localStyles.subHeader}>Provider Details</Text>
              <View style={localStyles.row}>
                <Text style={localStyles.label}>Business:</Text>
                <Text style={localStyles.value}>{user.provider_profile.business_name}</Text>
              </View>
              <View style={localStyles.row}>
                <Text style={localStyles.label}>Rating:</Text>
                <Text style={localStyles.value}>{user.provider_profile.rating}</Text>
              </View>
            </View>
          )}
        </View>

        <SecondaryButton title="Log Out" onPress={handleLogout} />
      </ScrollView>
    </SafeAreaView>
  );
};

export default ProfileScreen;

const localStyles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: metrics.gutter / 2,
  },
  section: {
    marginTop: metrics.gutter,
  },
  label: {
    fontWeight: '600',
    color: colors.text,
  },
  value: {
    color: colors.text,
  },
  subHeader: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text,
    marginBottom: metrics.gutter / 2,
  },
  logoutWrapper: {
    marginTop: metrics.gutter,
  },
});
