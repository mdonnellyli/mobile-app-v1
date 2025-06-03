import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import PrimaryButton from '../components/PrimaryButton';

describe('PrimaryButton', () => {
  it('renders with title', () => {
    const { getByText } = render(
      <PrimaryButton title="Login" onPress={() => {}} />
    );
    expect(getByText('Login')).toBeTruthy();
  });

  it('calls onPress when tapped', () => {
    const onPressMock = jest.fn();
    const { getByText } = render(
      <PrimaryButton title="Submit" onPress={onPressMock} />
    );
    fireEvent.press(getByText('Submit'));
    expect(onPressMock).toHaveBeenCalled();
  });
});
