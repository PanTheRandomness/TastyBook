import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import { Register } from '../Register';
import { register } from '../../api/userApi';
import { BrowserRouter as Router } from 'react-router-dom';

// Mock the register function
jest.mock('../../api/userApi', () => ({
  register: jest.fn(),
}));

describe('Register component', () => {
  test('should call onLogin with token and navigate to "/" when registering succeeds', async () => {
    // Arrange
    const token = 'mockedToken';
    const onLoginMock = jest.fn();
    const name = 'testname';
    const email = 'testemail';
    const username = 'testuser';
    const password = 'testpassword';
    register.mockResolvedValueOnce({ token });

    // Act
    const { getByPlaceholderText, getByTestId } = render(
      <Router>
        <Register onLogin={onLoginMock} />
      </Router>
    );
    fireEvent.change(getByPlaceholderText('name'), {
      target: { value: name },
    });
    fireEvent.change(getByPlaceholderText('email'), {
      target: { value: email },
    });
    fireEvent.change(getByPlaceholderText('username'), {
      target: { value: username },
    });
    fireEvent.change(getByPlaceholderText('password'), {
      target: { value: password },
    });
    fireEvent.submit(getByTestId('register-button'));

    // Assert
    await waitFor(() => {
      expect(onLoginMock).toHaveBeenCalledWith(token);
      expect(window.location.pathname).toBe('/');
    });
  });

  test('should log error when register fails', async () => {
    // Arrange
    console.error = jest.fn(); // Mock console.error
    const onLoginMock = jest.fn();
    const name = 'testname';
    const email = 'testemail';
    const username = 'testuser';
    const password = 'testpassword';
    const errorMessage = 'Invalid credentials';
    register.mockRejectedValueOnce(new Error(errorMessage));

    // Act
    const { getByPlaceholderText, getByTestId } = render(
      <Router>
        <Register onLogin={onLoginMock} />
      </Router>
    );
    fireEvent.change(getByPlaceholderText('name'), {
      target: { value: name },
    });
    fireEvent.change(getByPlaceholderText('email'), {
      target: { value: email },
    });
    fireEvent.change(getByPlaceholderText('username'), {
      target: { value: username },
    });
    fireEvent.change(getByPlaceholderText('password'), {
      target: { value: password },
    });

    fireEvent.submit(getByTestId('register-button'));

    // Assert
    await waitFor(() => expect(console.error).toHaveBeenCalledWith('Registering failed.'));
  });
});
