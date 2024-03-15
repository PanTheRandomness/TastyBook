import React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import { Register } from '../Register';
import { register } from '../../api/userApi';
import { BrowserRouter as Router } from 'react-router-dom';

// Mock the register function
jest.mock('../../api/userApi', () => ({
  register: jest.fn(),
}));

describe('Register component', () => {
  test('should display success dialog when registering succeeds', async () => {
    // Arrange
    const name = 'testname';
    const email = 'testemail';
    const username = 'testuser';
    const password = 'testpassword';
    register.mockResolvedValueOnce({ ok: true });

    // Act
    const { getByPlaceholderText, getByTestId, queryByText } = render(
      <Router>
        <Register />
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
    await waitFor(async () => {
      expect(queryByText('You have received an email with a confirmation link.')).toBeInTheDocument();
    });
  });

  test('should log error when register fails', async () => {
    // Arrange
    const onLoginMock = jest.fn();
    const name = 'testname';
    const email = 'testemail';
    const username = 'testuser';
    const password = 'testpassword';
    const errorMessage = 'Username or email is already in use.';
    register.mockRejectedValueOnce(new Error(errorMessage));

    // Act
    const { getByPlaceholderText, getByTestId } = render(
      <Router>
        <Register />
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
    await waitFor(async () => {
      const errorElement = await screen.findByText(errorMessage);
      expect(errorElement).toBeInTheDocument();
    });
  });
});
