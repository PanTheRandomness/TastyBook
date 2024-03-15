import React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import { AdminRegister } from '../AdminRegister';
import { adminregister } from '../../api/userApi';
import { BrowserRouter as Router } from 'react-router-dom';


jest.mock('../../api/userApi', () => ({
  adminregister: jest.fn(),
}));

describe('AdminRegister component', () => {
  test('should display success dialog when registering succeeds', async () => {
    // Arrange
    const name = 'testname';
    const email = 'testemail';
    const username = 'testuser';
    const password = 'testpassword';
    const api_key = 'api_key';
    adminregister.mockResolvedValueOnce({ ok: true });

    // Act
    const { getByPlaceholderText, getByTestId, queryByText } = render(
      <Router>
        <AdminRegister />
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
      expect(queryByText('You have received an email with a confirmation link.')).toBeInTheDocument();
    });
  });

  test('should log error when adminregister fails', async () => {
    // Arrange
    const onLoginMock = jest.fn();
    const name = 'testname';
    const email = 'testemail';
    const username = 'testuser';
    const password = 'testpassword';
    const api_key = 'testapi key';
    const errorMessage = 'Invalid credentials';
    adminregister.mockRejectedValueOnce(new Error(errorMessage));

    // Act
    render(
      <Router>
        <AdminRegister />
      </Router>
    );

    fireEvent.change(screen.getByPlaceholderText('name'), {
      target: { value: name },
    });
    fireEvent.change(screen.getByPlaceholderText('email'), {
      target: { value: email },
    });
    fireEvent.change(screen.getByPlaceholderText('username'), {
      target: { value: username },
    });
    fireEvent.change(screen.getByPlaceholderText('password'), {
      target: { value: password },
    });
    fireEvent.change(screen.getByPlaceholderText('api key'), {
      target: { value: api_key },
    });
    fireEvent.submit(screen.getByTestId('register-button'));

    // Assert
    await waitFor(async () => {
      const errorElement = await screen.findByText(errorMessage);
      expect(errorElement).toBeInTheDocument();
    });
  });
});
