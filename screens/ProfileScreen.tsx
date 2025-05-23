import React, { FC, useEffect, useState } from 'react';
import {
  SafeAreaView,
  Text,
  View,
  StyleSheet,
  Alert,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
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
  const initial: User = route.params.user;
  const [user, setUser]   = useState<User | null>(initial);
  const [loading, setLoading] = useState(false);

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
        // ignore errors
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
      <LinearGradient colors={['#F7FAFA', '#E5F6F7']} style={styles.gradient}>
        <SafeAreaView style={styles.container}>
          <ActivityIndicator size="large" />
        </SafeAreaView>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient colors={['#E5F6F7', '#F7FAFA']} style={styles.gradient}>
      <SafeAreaView style={styles.container}>
        <Text style={styles.header}>Your Profile</Text>
        <LinearGradient
          colors={[COLORS.softWhite, COLORS.lightGrey]}
          style={styles.card}
        >
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
        </LinearGradient>

        <SecondaryButton
          title="Log Out"
          onPress={handleLogout}
          style={styles.logoutBtn}
          textStyle={styles.logoutText}
        />
      </SafeAreaView>
    </LinearGradient>
  );
};

export default ProfileScreen;

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
  logoutBtn: {
    backgroundColor: COLORS.coral,
    borderRadius:    20,
    paddingVertical: 12,
    paddingHorizontal: 40,
  },
  logoutText: {
    fontSize:   16,
    fontWeight: 'bold',
    color:      COLORS.white,
  },
});