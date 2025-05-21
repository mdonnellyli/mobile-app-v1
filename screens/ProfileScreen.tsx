import React, { FC } from 'react';
import {
  SafeAreaView,
  Text,
  View,
  StyleSheet,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation';
import Card from '../components/Card';
import SecondaryButton from '../components/SecondaryButton';
import { COLORS } from '../constants/Colors';

type Props = NativeStackScreenProps<RootStackParamList, 'Profile'>;

const ProfileScreen: FC<Props> = ({ route, navigation }) => {
  const { user } = route.params;

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
            try {
              await AsyncStorage.removeItem('user');
            } catch (e) {
              console.warn('Failed to clear user:', e);
            }
            navigation.replace('Login');
          },
        },
      ],
      { cancelable: true }
    );
  };

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
          <Text style={styles.fieldValue}>
            {user.email ?? 'N/A'}
          </Text>
        </View>
      </Card>

      <SecondaryButton
        title="Log Out"
        onPress={handleLogout}
      />
    </SafeAreaView>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.softWhite,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.navy,
    marginBottom: 24,
  },
  fieldRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  fieldLabel: {
    fontWeight: '600',
    color: COLORS.navy,
  },
  fieldValue: {
    color: COLORS.navy,
  },
});