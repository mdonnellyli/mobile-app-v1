import React from 'react';
import { render, fireEvent, waitFor, act } from '@testing-library/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';
import RegisterCustomerScreen from '../screens/RegisterCustomerScreen';
import { NavigationContainer } from '@react-navigation/native';

jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);

global.fetch = jest.fn();

const mockNavigation = {
  replace: jest.fn(),
};

const mockRoles = [
  { id: 1, name: 'customer' },
  { id: 2, name: 'admin' },
];

const renderScreen = () =>
  render(
    <NavigationContainer>
      <RegisterCustomerScreen navigation={mockNavigation} />
    </NavigationContainer>
  );

describe('RegisterCustomerScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders inputs and buttons after roles load', async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockRoles,
    });

    const { getByPlaceholderText, getByText } = renderScreen();

    await waitFor(() => {
      expect(getByPlaceholderText(/phone number/i)).toBeTruthy();
      expect(getByPlaceholderText(/name/i)).toBeTruthy();
      expect(getByPlaceholderText(/location/i)).toBeTruthy();
      expect(getByPlaceholderText(/email/i)).toBeTruthy();
      expect(getByText('Register')).toBeTruthy();
      expect(getByText('Back to Login')).toBeTruthy();
    });
  });

  it('shows alert for missing fields', async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockRoles,
    });

    const alertSpy = jest.spyOn(Alert, 'alert');

    const { getByText } = renderScreen();
    await waitFor(() => getByText('Register'));

    fireEvent.press(getByText('Register'));

    await waitFor(() => {
      expect(alertSpy).toHaveBeenCalledWith(
        'Invalid Phone',
        'Enter a valid 10-digit US number.'
      );
    });
  });

  it('alerts if no customer role is found', async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => [{ id: 2, name: 'not-customer' }],
    });

    const alertSpy = jest.spyOn(Alert, 'alert');

    const { getByText, getByPlaceholderText } = renderScreen();
    await waitFor(() => getByText('Register'));

    fireEvent.changeText(getByPlaceholderText(/phone number/i), '(123) 456-7890');
    fireEvent.changeText(getByPlaceholderText(/name/i), 'Alice');
    fireEvent.changeText(getByPlaceholderText(/location/i), 'NYC');

    fireEvent.press(getByText('Register'));

    await waitFor(() => {
      expect(alertSpy).toHaveBeenCalledWith(
        'Configuration Error',
        'Customer role not found on server.'
      );
    });
  });

  it('registers a user and navigates to profile', async () => {
    (fetch as jest.Mock)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockRoles,
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          id: 5,
          phone_number: '+11234567890',
          name: 'Alice',
          location: 'NYC',
          email: 'alice@example.com',
          roles: ['customer'],
        }),
      });

    const { getByText, getByPlaceholderText } = renderScreen();
    await waitFor(() => getByText('Register'));

    fireEvent.changeText(getByPlaceholderText(/phone number/i), '(123) 456-7890');
    fireEvent.changeText(getByPlaceholderText(/name/i), 'Alice');
    fireEvent.changeText(getByPlaceholderText(/location/i), 'NYC');
    fireEvent.changeText(getByPlaceholderText(/email/i), 'alice@example.com');

    fireEvent.press(getByText('Register'));

    await waitFor(() => {
      expect(mockNavigation.replace).toHaveBeenCalledWith('Profile', {
        user: {
          id: 5,
          phoneNumber: '+11234567890',
          name: 'Alice',
          location: 'NYC',
          email: 'alice@example.com',
          roles: ['customer'],
        },
      });
    });
  });

  it('shows alert if registration fails', async () => {
    (fetch as jest.Mock)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockRoles,
      })
      .mockResolvedValueOnce({
        ok: false,
        json: async () => ({ detail: 'Server down' }),
      });

    const alertSpy = jest.spyOn(Alert, 'alert');

    const { getByText, getByPlaceholderText } = renderScreen();
    await waitFor(() => getByText('Register'));

    fireEvent.changeText(getByPlaceholderText(/phone number/i), '(123) 456-7890');
    fireEvent.changeText(getByPlaceholderText(/name/i), 'Alice');
    fireEvent.changeText(getByPlaceholderText(/location/i), 'NYC');

    fireEvent.press(getByText('Register'));

    await waitFor(() => {
      expect(alertSpy).toHaveBeenCalledWith('Registration Failed', 'Server down');
    });
  });

  it('navigates back to login', async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockRoles,
    });

    const { getByText } = renderScreen();
    await waitFor(() => getByText('Back to Login'));

    fireEvent.press(getByText('Back to Login'));
    expect(mockNavigation.replace).toHaveBeenCalledWith('Login');
  });
});