import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Admin from '../Admin';
import { getAllUsers, deleteUser } from '../../api/adminApi';

jest.mock('../../api/adminApi', () => ({
  getAllUsers: jest.fn(),
  deleteUser: jest.fn()
}));

describe('Admin component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders admin page with user data', async () => {
    const users = [
      { id: 1, name: 'User One', username: 'user1', email: 'user1@example.com', admin: true },
      { id: 2, name: 'User Two', username: 'user2', email: 'user2@example.com', admin: false }
    ];

    getAllUsers.mockResolvedValue(users);

    render(<Admin />);

    await waitFor(() => {
      users.forEach(user => {
        expect(screen.getByTestId(`user-${user.id}`)).toBeInTheDocument();
        expect(screen.getByText(user.name)).toBeInTheDocument();
        expect(screen.getByText(user.username)).toBeInTheDocument();
        expect(screen.getByText(user.email)).toBeInTheDocument();
      });
    });
  });

  test('deletes user when delete button is clicked', async () => {
    const users = [
      { id: 1, name: 'User One', username: 'user1', email: 'user1@example.com', admin: true },
      { id: 2, name: 'User Two', username: 'user2', email: 'user2@example.com', admin: false }
    ];
    
    getAllUsers.mockResolvedValue(users);
    deleteUser.mockResolvedValue();
    
    render(<Admin />);
    
    await waitFor(() => {
      users.forEach(user => {
        const deleteButton = screen.getByTestId(`user-${user.id}`).querySelector('button'); 
        fireEvent.click(deleteButton); 
      });
    });
    
    await waitFor(() => {
      expect(deleteUser).toHaveBeenCalledTimes(users.length); // Odottaa deleteUser-funktion kutsuttavan kerran jokaista poistettavaa käyttäjää kohti
      users.forEach(user => {
        expect(deleteUser).toHaveBeenCalledWith(user.id, expect.any(String)); 
      });
    });
  });  
});
