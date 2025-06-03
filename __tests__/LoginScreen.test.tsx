import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';

import LoginScreen from '../screens/LoginScreen';

jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);

global.fetch = jest.fn();

describe('LoginScreen', () => {
  const mockNavigation = {
    replace: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the login screen', () => {
    const { getByPlaceholderText, getByText } = render(
      <LoginScreen navigation={mockNavigation} />
    );

    expect(getByPlaceholderText(/phone number/i)).toBeTruthy();
    expect(getByText(/log in/i)).toBeTruthy();
    expect(getByText(/register as customer/i)).toBeTruthy();
  });

  it('shows alert for invalid phone number', () => {
    jest.spyOn(Alert, 'alert');

    const { getByText } = render(<LoginScreen navigation={mockNavigation} />);
    fireEvent.press(getByText(/log in/i));

    expect(Alert.alert).toHaveBeenCalledWith(
      'Invalid Phone',
      expect.stringMatching(/valid 10-digit/i)
    );
  });

  it('shows alert if phone is not registered (404)', async () => {
    jest.spyOn(Alert, 'alert');
    (fetch as jest.Mock).mockResolvedValueOnce({ status: 404 });

    const { getByText, getByPlaceholderText } = render(
      <LoginScreen navigation={mockNavigation} />
    );

    fireEvent.changeText(getByPlaceholderText(/phone number/i), '(123) 456-7890');
    fireEvent.press(getByText(/log in/i));

    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith(
        'Not Registered',
        expect.stringMatching(/please register/i)
      );
    });
  });

  it('shows alert on server/network error', async () => {
    jest.spyOn(Alert, 'alert');
    (fetch as jest.Mock).mockResolvedValueOnce({ ok: false, status: 500 });

    const { getByText, getByPlaceholderText } = render(
      <LoginScreen navigation={mockNavigation} />
    );

    fireEvent.changeText(getByPlaceholderText(/phone number/i), '(123) 456-7890');
    fireEvent.press(getByText(/log in/i));

    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith(
        'Login Failed',
        expect.stringMatching(/500/)
      );
    });
  });

  it('logs in successfully and navigates to Profile', async () => {
    const mockUser = {
      id: 1,
      phone_number: '+11234567890',
      name: 'Test User',
      location: 'NY',
      email: 'test@example.com',
      roles: ['customer'],
    };

    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockUser,
    });

    const { getByText, getByPlaceholderText } = render(
      <LoginScreen navigation={mockNavigation} />
    );

    fireEvent.changeText(getByPlaceholderText(/phone number/i), '(123) 456-7890');
    fireEvent.press(getByText(/log in/i));

    await waitFor(() => {
      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        'user',
        expect.any(String)
      );
      expect(mockNavigation.replace).toHaveBeenCalledWith('Profile', {
        user: expect.objectContaining({ id: 1 }),
      });
    });
  });

  it('navigates to RegisterCustomer screen', () => {
    const { getByText } = render(
      <LoginScreen navigation={mockNavigation} />
    );

    fireEvent.press(getByText(/register as customer/i));
    expect(mockNavigation.replace).toHaveBeenCalledWith('RegisterCustomer');
  });
});
