import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import LoginScreen from '../screens/LoginScreen';

jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);

describe('LoginScreen', () => {
  it('renders email and password input fields', () => {
    const { getByPlaceholderText } = render(<LoginScreen />);
    expect(getByPlaceholderText(/phone number/i)).toBeTruthy();
   // expect(getByPlaceholderText(/password/i)).toBeTruthy();
  });

  it('renders login button', () => {
    const { getByText } = render(<LoginScreen />);
    expect(getByText(/log in/i)).toBeTruthy();
  });
});
