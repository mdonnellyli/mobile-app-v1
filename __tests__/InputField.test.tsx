import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import InputField from '../components/InputField';

describe('InputField', () => {
  it('renders correctly with placeholder and value', () => {
    const { getByPlaceholderText } = render(
      <InputField
        placeholder="Email"
        value="test@example.com"
        onChangeText={() => {}}
      />
    );
    expect(getByPlaceholderText('Email')).toBeTruthy();
  });

  it('calls onChangeText when typing', () => {
    const onChangeTextMock = jest.fn();
    const { getByPlaceholderText } = render(
      <InputField
        placeholder="Username"
        value=""
        onChangeText={onChangeTextMock}
      />
    );

    fireEvent.changeText(getByPlaceholderText('Username'), 'new text');
    expect(onChangeTextMock).toHaveBeenCalledWith('new text');
  });
});
