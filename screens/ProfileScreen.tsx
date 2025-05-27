// screens/ProfileScreen.tsx

import React, { FC, useState, useCallback } from 'react';
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  ActivityIndicator,
  Alert,
  StyleSheet,
  Platform,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useFocusEffect } from '@react-navigation/native';

import { RootStackParamList } from '../navigation';
import Card from '../components/Card';
import PrimaryButton from '../components/PrimaryButton';
import SecondaryButton from '../components/SecondaryButton';
import { COLORS } from '../constants/Colors';
import { User } from './types';

type Props = NativeStackScreenProps<RootStackParamList, 'Profile'>;
const API_BASE_URL = 'http://localhost:8000';
const STORAGE_KEY = 'custom_profiles';

interface CustomProfile {
  userId:      number;
  title:       string;
  description: string;
  createdAt:   string;
}

const ProfileScreen: FC<Props> = ({ route, navigation }) => {
  const initial: User = route.params.user;
  const [user, setUser]         = useState<User>(initial);
  const [loading, setLoading]   = useState(false);
  const [profiles, setProfiles] = useState<CustomProfile[]>([]);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      // 1) Refresh user from API
      const res = await fetch(`${API_BASE_URL}/users/${initial.id}`);
      if (res.ok) {
        const data: any = await res.json();
        setUser({
          id:          data.id,
          phoneNumber: data.phone_number,
          name:        data.name,
          location:    data.location,
          email:       data.email,
          roles:       data.roles,
        });
      }
      // 2) Load custom profiles
      const raw = await AsyncStorage.getItem(STORAGE_KEY);
      const all: CustomProfile[] = raw ? JSON.parse(raw) : [];
      setProfiles(all.filter(p => p.userId === initial.id));
    } catch (e) {
      console.warn('Error loading profile data', e);
    } finally {
      setLoading(false);
    }
  }, [initial.id]);

  // ⚠️ Don't pass an async function directly; wrap it so it returns void/cleanup only
  useFocusEffect(
    useCallback(() => {
      loadData();
      // no cleanup needed; return undefined
    }, [loadData])
  );

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

  if (loading) {
    return (
      <SafeAreaView style={styles.center}>
        <ActivityIndicator size="large" />
      </SafeAreaView>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Your Profile</Text>

      <Card>
        <View style={styles.row}>
          <Text style={styles.label}>Phone:</Text>
          <Text style={styles.value}>{user.phoneNumber}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Name:</Text>
          <Text style={styles.value}>{user.name}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Location:</Text>
          <Text style={styles.value}>{user.location}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Email:</Text>
          <Text style={styles.value}>{user.email ?? 'N/A'}</Text>
        </View>
      </Card>

      <Text style={styles.sectionHeader}>My Profiles</Text>
      <Card>
        {profiles.length > 0 ? (
          profiles.map((p, i) => (
            <View key={i} style={styles.profileRow}>
              <Text style={styles.profileTitle}>{p.title}</Text>
              <Text style={styles.profileDesc}>{p.description}</Text>
            </View>
          ))
        ) : (
          <Text style={styles.noProfilesText}>
            You haven’t created any profiles yet.
          </Text>
        )}
      </Card>

      <View style={styles.buttonContainer}>
        <PrimaryButton
          title="Create Profile"
          onPress={() => navigation.navigate('CreateProfile', { user })}
        />
      </View>

      <View style={styles.buttonContainer}>
        <SecondaryButton title="Log Out" onPress={handleLogout} />
      </View>
    </ScrollView>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  center: {
    flex:           1,
    justifyContent: 'center',
    alignItems:     'center',
  },
  container: {
    padding:    20,
    alignItems: 'center',
  },
  header: {
    fontSize:     24,
    fontWeight:   Platform.select({ ios: '700', android: 'bold' }),
    color:        COLORS.navy,
    marginBottom: 20,
  },
  row: {
    flexDirection:  'row',
    justifyContent: 'space-between',
    marginBottom:   12,
  },
  label: {
    fontWeight: '600',
    color:      COLORS.navy,
  },
  value: {
    color: COLORS.navy,
  },
  sectionHeader: {
    width:       '100%',
    fontSize:    18,
    fontWeight:  '600',
    color:       COLORS.navy,
    marginTop:   20,
    marginBottom: 10,
  },
  profileRow: {
    marginBottom: 12,
  },
  profileTitle: {
    fontSize:   16,
    fontWeight: '600',
    color:      COLORS.navy,
  },
  profileDesc: {
    color: COLORS.navy,
  },
  noProfilesText: {
    color:      COLORS.navy,
    fontStyle: 'italic',
  },
  buttonContainer: {
    marginTop:  16,
    width:      '80%',
  },
});