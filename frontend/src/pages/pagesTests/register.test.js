import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Register } from '../Register';
import {register} from '../../api/userApi'

// Mockataan userApi
jest.mock('../../api/userApi', () => ({
  register: jest.fn(),
}));


describe('Register component', () => {
  test('should call onLogin when registration is successful', async () => {
    const onLoginMock = jest.fn();
    Register.mockResolvedValueOnce({ token: 'mockToken' });

    render(<Register onLogin={onLoginMock} />);

    // Täytä kaikki syötekentät
    fireEvent.change(screen.getByPlaceholderText('name'), { target: { value: 'John Doe' } });
    fireEvent.change(screen.getByPlaceholderText('email'), { target: { value: 'john.doe@example.com' } });
    fireEvent.change(screen.getByPlaceholderText('username'), { target: { value: 'john_doe' } });
    fireEvent.change(screen.getByPlaceholderText('password'), { target: { value: 'password123' } });

    // Klikkaa rekisteröintipainiketta
    fireEvent.click(screen.getByText('Register'));

    // Odota, että rekisteröintipyyntö suoritetaan ja onnistuu
    await waitFor(() => {
      // Tarkista, että onLogin on kutsuttu oikeilla tiedoilla
      expect(onLoginMock).toHaveBeenCalledWith('mockToken');
    });
  });

  test('should handle registration failure', async () => {
    register.mockRejectedValueOnce(new Error('Registration failed'));

    render(<Register onLogin={() => {}} />);

    // Klikkaa rekisteröintipainiketta
    fireEvent.click(screen.getByText('Register'));

    // Odota, että rekisteröintipyyntö suoritetaan ja epäonnistuu
    await waitFor(() => {
      // Tarkista, että "Registering failed" on tulostettu konsoliin
      expect(console.error).toHaveBeenCalledWith('Registering failed');
    });
  });
});
