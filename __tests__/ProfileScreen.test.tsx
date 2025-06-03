import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';
import ProfileScreen from '../screens/ProfileScreen';
import { NavigationContainer } from '@react-navigation/native';

jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);

const renderWithNavigation = (ui: React.ReactElement) =>
  render(<NavigationContainer>{ui}</NavigationContainer>);

// 🔧 Mock global fetch
global.fetch = jest.fn();

describe('ProfileScreen', () => {
  const mockUser = {
    id: 1,
    name: 'Jane Doe',
    phoneNumber: '+15555555555',
    location: 'Springfield',
    email: 'jane@example.com',
    roles: ['customer'],
  };

  const apiUserResponse = {
    id: 1,
    name: 'Jane Doe',
    phone_number: '+15555555555', // 🟢 match API field name
    location: 'Springfield',
    email: 'jane@example.com',
    roles: ['customer'],
  };

  const mockNavigation = {
    navigate: jest.fn(),
    replace: jest.fn(),
  };

  const mockRoute = {
    params: { user: mockUser },
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders user info and profiles', async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => apiUserResponse,
    });

    const profiles = [
      {
        userId: 1,
        title: 'DJ',
        description: 'Spins electronic music',
        createdAt: new Date().toISOString(),
      },
    ];
    await AsyncStorage.setItem('custom_profiles', JSON.stringify(profiles));

    const { getByText } = renderWithNavigation(
      <ProfileScreen navigation={mockNavigation} route={mockRoute} />
    );

    await waitFor(() => {
      expect(getByText('Jane Doe')).toBeTruthy();
      expect(getByText('DJ')).toBeTruthy();
      expect(getByText('Spins electronic music')).toBeTruthy();
    });
  });

  it('shows no profiles message if empty', async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => apiUserResponse,
    });

    await AsyncStorage.setItem('custom_profiles', JSON.stringify([]));

    const { getByText } = renderWithNavigation(
      <ProfileScreen navigation={mockNavigation} route={mockRoute} />
    );

    await waitFor(() => {
      expect(getByText(/you haven’t created any profiles yet/i)).toBeTruthy();
    });
  });

  it('navigates to CreateProfile when button is pressed', async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => apiUserResponse,
    });

    await AsyncStorage.setItem('custom_profiles', JSON.stringify([]));

    const { getByText } = renderWithNavigation(
      <ProfileScreen navigation={mockNavigation} route={mockRoute} />
    );

    await waitFor(() => getByText(/create profile/i));
    fireEvent.press(getByText(/create profile/i));

    expect(mockNavigation.navigate).toHaveBeenCalledWith('CreateProfile', {
      user: mockUser,
    });
  });

  it('logs out when alert confirm is pressed', async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => apiUserResponse,
    });

    await AsyncStorage.setItem('user', JSON.stringify(mockUser));

    jest.spyOn(Alert, 'alert').mockImplementation((title, message, buttons) => {
      const logoutBtn = buttons?.find(b => b.text === 'Log Out');
      if (logoutBtn && logoutBtn.onPress) logoutBtn.onPress();
    });

    const { getByText } = renderWithNavigation(
      <ProfileScreen navigation={mockNavigation} route={mockRoute} />
    );

    await waitFor(() => getByText(/log out/i));
    fireEvent.press(getByText(/log out/i));

    await waitFor(() => {
      expect(AsyncStorage.removeItem).toHaveBeenCalledWith('user');
      expect(mockNavigation.replace).toHaveBeenCalledWith('Login');
    });
  });
});