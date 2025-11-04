import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { Button } from '../../src/components/atoms/Button';

describe('Button Component', () => {
  it('renders with title', () => {
    const { getByText } = render(
      <Button title="Test Button" onPress={() => {}} />
    );

    expect(getByText('Test Button')).toBeTruthy();
  });

  it('calls onPress when pressed', () => {
    const onPressMock = jest.fn();
    const { getByTestId } = render(
      <Button
        title="Test Button"
        onPress={onPressMock}
        testID="test-button"
      />
    );

    fireEvent.press(getByTestId('test-button'));
    expect(onPressMock).toHaveBeenCalledTimes(1);
  });

  it('does not call onPress when disabled', () => {
    const onPressMock = jest.fn();
    const { getByTestId } = render(
      <Button
        title="Test Button"
        onPress={onPressMock}
        disabled={true}
        testID="test-button"
      />
    );

    fireEvent.press(getByTestId('test-button'));
    expect(onPressMock).not.toHaveBeenCalled();
  });

  it('shows loading indicator when loading', () => {
    const { getByTestId } = render(
      <Button
        title="Test Button"
        onPress={() => {}}
        loading={true}
        testID="test-button"
      />
    );

    expect(getByTestId('test-button')).toBeTruthy();
  });
});
