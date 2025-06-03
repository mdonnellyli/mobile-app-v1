// navigation/index.tsx

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import LoginScreen from '../screens/LoginScreen';
import RegisterCustomerScreen from '../screens/RegisterCustomerScreen';
import CreateProfileScreen from '../screens/CreateProfileScreen';
import ProfileScreen from '../screens/ProfileScreen';
import { User } from '../screens/types';

export type RootStackParamList = {
  Login: undefined;
  RegisterCustomer: undefined;
  RegisterBusiness: undefined;
  Profile: { user: User };
  CreateProfile: { user: User };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="RegisterCustomer" component={RegisterCustomerScreen} />        
        <Stack.Screen name="Profile" component={ProfileScreen} />
        <Stack.Screen name="CreateProfile" component={CreateProfileScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}