import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import CreateProfileScreen from '../screens/CreateProfileScreen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';

describe('CreateProfileScreen', () => {
  const mockRoute = {
    params: {
      user: { name: 'Test User', id: '123' },
    },
  };

  const mockNavigation = {
    navigate: jest.fn(),
    goBack: jest.fn(),
    setOptions: jest.fn(),
  };

  it('renders input fields and continue button', () => {
    const { getByPlaceholderText, getByText } = render(
      <CreateProfileScreen route={mockRoute} navigation={mockNavigation} />
    );

    expect(getByPlaceholderText(/Profile Title/i)).toBeTruthy();
    expect(getByPlaceholderText(/description/i)).toBeTruthy();
    expect(getByText(/save profile/i)).toBeTruthy();
    expect(getByText(/cancel/i)).toBeTruthy();
  });

  it('does not crash when user is passed in params', () => {
    const { getByText } = render(
      <CreateProfileScreen route={mockRoute} navigation={mockNavigation} />
    );

    expect(getByText(/save profile/i)).toBeTruthy();
    expect(getByText(/cancel/i)).toBeTruthy();
  });


   it('saves profile to AsyncStorage and navigates', async () => {


    const setItemSpy = jest.spyOn(AsyncStorage, 'setItem');

    const { getByPlaceholderText, getByText } = render(
      <CreateProfileScreen route={mockRoute} navigation={mockNavigation} />
    );

    fireEvent.changeText(getByPlaceholderText(/Profile Title/i), 'Johnny Blaze');
    fireEvent.changeText(getByPlaceholderText(/description/i), 'Personal Motorcyle Courier/');

    fireEvent.press(getByText(/save profile/i));

    await waitFor(() => {
  expect(setItemSpy).toHaveBeenCalled();  
  expect(mockNavigation.goBack).toHaveBeenCalled();
});
  });

  it('shows alert if profile title is missing', async () => {
  jest.spyOn(Alert, 'alert');

  const { getByPlaceholderText, getByText } = render(
    <CreateProfileScreen route={mockRoute} navigation={mockNavigation} />
  );

  fireEvent.changeText(getByPlaceholderText(/description/i), 'A profile with no title');
  fireEvent.press(getByText(/save profile/i));

  await waitFor(() => {
    expect(Alert.alert).toHaveBeenCalledWith(
      'Title required',
      expect.stringMatching(/please enter a title for your profile/i)
    );
  });
});

it('calls navigation.goBack when cancel button is pressed', () => {
  const mockGoBack = jest.fn();

  const { getByText } = render(
    <CreateProfileScreen
      route={mockRoute}
      navigation={{ ...mockNavigation, goBack: mockGoBack }}
    />
  );

  fireEvent.press(getByText(/cancel/i));

  expect(mockGoBack).toHaveBeenCalled();
});


});