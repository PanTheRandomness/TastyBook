import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Admin from '../Admin';
import { getAllUsers, deleteUser } from '../../api/adminApi';

// Lisää tarvittava tuonti
import { waitFor } from '@testing-library/react';

jest.mock('../../api/adminApi', () => ({
  getAllUsers: jest.fn().mockResolvedValue([
    { id: 1, name: 'User One', username: 'user1', email: 'user1@example.com', admin: true },
    { id: 2, name: 'User Two', username: 'user2', email: 'user2@example.com', admin: false }
  ]),
  deleteUser: jest.fn().mockResolvedValue()
}));

describe('Admin component', () => {
  test('deletes user correctly', async () => {
    const users = [
      { id: 1, name: 'User One', username: 'user1', email: 'user1@example.com', admin: true },
      { id: 2, name: 'User Two', username: 'user2', email: 'user2@example.com', admin: false }
    ];

    // Korvaa `waitFor`-kutsu `await`-lauseella
    await getAllUsers();

    render(<Admin users={users} />);
    
    // Odota, että käyttäjä on lisätty
    await waitFor(() => expect(screen.getByTestId('user-2')).toBeInTheDocument());

    fireEvent.click(screen.getByText('Delete'));

    await waitFor(() => {
      expect(deleteUser).toHaveBeenCalledWith(2, expect.any(String));
    });

    await waitFor(() => {
      expect(screen.queryByTestId('user-2')).not.toBeInTheDocument();
    });
  });
});
