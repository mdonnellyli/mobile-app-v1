import React, { FC, useEffect, useState } from 'react';
import {
  SafeAreaView,
  Text,
  View,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import { RootStackParamList } from '../navigation';
import Card            from '../components/Card';
import SecondaryButton from '../components/SecondaryButton';
import { COLORS }      from '../constants/Colors';
import { User }        from './types';

type Props = NativeStackScreenProps<RootStackParamList, 'Profile'>;

const API_BASE_URL = 'http://localhost:8000';

const ProfileScreen: FC<Props> = ({ route, navigation }) => {
  // initial user from route params
  const initial: User = route.params.user;
  const [user, setUser] = useState<User | null>(initial);
  const [loading, setLoading] = useState(false);

  // on mount, re-fetch the latest user by ID
  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const res = await fetch(`${API_BASE_URL}/users/${initial.id}`);
        if (res.ok) {
          const fresh: any = await res.json();
          const u: User = {
            id:          fresh.id,
            phoneNumber: fresh.phone_number,
            name:        fresh.name,
            location:    fresh.location,
            email:       fresh.email,
          };
          setUser(u);
          await AsyncStorage.setItem('user', JSON.stringify(u));
        }
      } catch {
        // ignore network failures
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleLogout = () => {
    Alert.alert(
      'Log Out?',
      'Are you sure you want to log out and clear your data?',
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
      ],
      { cancelable: true }
    );
  };

  if (loading || !user) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Your Profile</Text>
      <Card>
        <View style={styles.fieldRow}>
          <Text style={styles.fieldLabel}>Phone:</Text>
          <Text style={styles.fieldValue}>{user.phoneNumber}</Text>
        </View>
        <View style={styles.fieldRow}>
          <Text style={styles.fieldLabel}>Name:</Text>
          <Text style={styles.fieldValue}>{user.name}</Text>
        </View>
        <View style={styles.fieldRow}>
          <Text style={styles.fieldLabel}>Location:</Text>
          <Text style={styles.fieldValue}>{user.location}</Text>
        </View>
        <View style={styles.fieldRow}>
          <Text style={styles.fieldLabel}>Email:</Text>
          <Text style={styles.fieldValue}>{user.email ?? 'N/A'}</Text>
        </View>
      </Card>
      <SecondaryButton title="Log Out" onPress={handleLogout} />
    </SafeAreaView>
  );
};

export default ProfileScreen;

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
  fieldRow: {
    flexDirection:  'row',
    justifyContent: 'space-between',
    marginBottom:   12,
  },
  fieldLabel: {
    fontWeight: '600',
    color:      COLORS.navy,
  },
  fieldValue: {
    color: COLORS.navy,
  },
});