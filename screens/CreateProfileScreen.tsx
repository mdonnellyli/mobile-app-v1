// screens/CreateProfileScreen.tsx

import React, { FC, useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  Text,
  StyleSheet,
  Alert,
  Platform,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';

import InputField      from '../components/InputField';
import PrimaryButton   from '../components/PrimaryButton';
import SecondaryButton from '../components/SecondaryButton';
import { COLORS }      from '../constants/Colors';
import { RootStackParamList } from '../navigation';
import { User }        from './types';

type Props = NativeStackScreenProps<RootStackParamList, 'CreateProfile'>;
const STORAGE_KEY = 'custom_profiles';

const CreateProfileScreen: FC<Props> = ({ route, navigation }) => {

  


  const { user } = route.params;
  const [title, setTitle]       = useState('');
  const [description, setDescription] = useState('');

  if (!user) {
    return <Text testID="missing-user">Missing user</Text>;
  }

  const handleSave = async () => {
    if (!title.trim()) {
      return Alert.alert('Title required', 'Please enter a title for your profile.');
    }

    try {
      // Load existing array
      const raw = await AsyncStorage.getItem(STORAGE_KEY);
      const all = raw ? JSON.parse(raw) : [];

      // Append new profile
      all.push({
        userId:      user.id,
        title:       title.trim(),
        description: description.trim(),
        createdAt:   new Date().toISOString(),
      });

      console.log('Saving profile...');
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(all));
      Alert.alert('Saved', 'Your profile has been created.');
      navigation.goBack();
    } catch (e: any) {
      console.warn(e);
      Alert.alert('Error', 'Could not save your profile.');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>New Custom Profile</Text>

      <InputField
        placeholder="Profile Title"
        value={title}
        onChangeText={setTitle}
        autoCapitalize="words"
      />

      <InputField
        placeholder="Description"
        value={description}
        onChangeText={setDescription}
        multiline
      />

      <PrimaryButton title="Save Profile" onPress={handleSave} />

      <SecondaryButton
        title="Cancel"
        onPress={() => navigation.goBack()}
        style={styles.cancelBtn}
      />
    </ScrollView>
  );
};

export default CreateProfileScreen;

const styles = StyleSheet.create({
  container: {
    padding:       20,
    alignItems:    'center',
  },
  header: {
    fontSize:       24,
    fontWeight:     Platform.select({ ios: '700', android: 'bold' }),
    color:          COLORS.navy,
    marginBottom:   20,
  },
  cancelBtn: {
    marginTop:     16,
    backgroundColor: COLORS.coral,
    width:           '70%',
  },
});