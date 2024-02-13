import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import { AdminRegister } from '../AdminRegister';
import { adminregister } from '../../api/userApi';
import { BrowserRouter as Router } from 'react-router-dom';

// Mock the register function
jest.mock('../../api/userApi', () => ({
  adminregister: jest.fn(),
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
    const api_key = 'api_key';
    adminregister.mockResolvedValueOnce({ token });

    // Act
    const { getByPlaceholderText, getByTestId } = render(
      <Router>
        <AdminRegister onLogin={onLoginMock} />
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
    fireEvent.change(getByPlaceholderText('api key'), {
        target: { value: api_key },
      });
    fireEvent.submit(getByTestId('register-button'));

    // Assert
    await waitFor(() => {
      expect(onLoginMock).toHaveBeenCalledWith(token);
      expect(window.location.pathname).toBe('/');
    });
  });

  test('should log error when adminregister fails', async () => {
    // Arrange
    console.error = jest.fn(); // Mock console.error
    const onLoginMock = jest.fn();
    const name = 'testname';
    const email = 'testemail';
    const username = 'testuser';
    const password = 'testpassword';
    const api_key = 'testapi key';
    const errorMessage = 'Invalid credentials';
    adminregister.mockRejectedValueOnce(new Error(errorMessage));

    // Act
    const { getByPlaceholderText, getByTestId } = render(
      <Router>
        <AdminRegister onLogin={onLoginMock} />
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
    fireEvent.change(getByPlaceholderText('api key'), {
        target: { value: api_key },
      });
    fireEvent.submit(getByTestId('register-button'));

    // Assert
    await waitFor(() => expect(console.error).toHaveBeenCalledWith('Registering failed.'));
  });
});
