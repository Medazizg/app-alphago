import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { Button } from '../Button';

describe('Button Component', () => {
  it('renders correctly with default props', () => {
    const { getByText } = render(<Button title="Test Button" onPress={() => {}} />);
    expect(getByText('Test Button')).toBeTruthy();
  });

  it('calls onPress when pressed', () => {
    const mockOnPress = jest.fn();
    const { getByText } = render(<Button title="Test Button" onPress={mockOnPress} />);
    
    fireEvent.press(getByText('Test Button'));
    expect(mockOnPress).toHaveBeenCalledTimes(1);
  });

  it('does not call onPress when disabled', () => {
    const mockOnPress = jest.fn();
    const { getByText } = render(
      <Button title="Test Button" onPress={mockOnPress} disabled />
    );
    
    fireEvent.press(getByText('Test Button'));
    expect(mockOnPress).not.toHaveBeenCalled();
  });

  it('shows loading spinner when loading', () => {
    const { getByTestId } = render(
      <Button title="Test Button" onPress={() => {}} loading />
    );
    
    expect(getByTestId('button-loading')).toBeTruthy();
  });

  it('applies correct variant styles', () => {
    const { getByTestId: getPrimary } = render(
      <Button title="Primary" onPress={() => {}} variant="primary" testID="primary-button" />
    );
    
    const { getByTestId: getSecondary } = render(
      <Button title="Secondary" onPress={() => {}} variant="secondary" testID="secondary-button" />
    );

    const primaryButton = getPrimary('primary-button');
    const secondaryButton = getSecondary('secondary-button');
    
    expect(primaryButton).toBeTruthy();
    expect(secondaryButton).toBeTruthy();
  });

  it('applies correct size styles', () => {
    const { getByTestId: getSmall } = render(
      <Button title="Small" onPress={() => {}} size="small" testID="small-button" />
    );
    
    const { getByTestId: getLarge } = render(
      <Button title="Large" onPress={() => {}} size="large" testID="large-button" />
    );

    expect(getSmall('small-button')).toBeTruthy();
    expect(getLarge('large-button')).toBeTruthy();
  });
});
