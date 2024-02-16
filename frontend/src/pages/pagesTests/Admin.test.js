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

  test('should delete user when delete button is clicked', async () => {
    const token = 'mockToken';
    const userId = 2; 
    const users = [
      { id: 1, name: 'User 1', username: 'user1', email: 'user1@example.com', admin: true },
      { id: userId, name: 'User 2', username: 'user2', email: 'user2@example.com', admin: false } 
    ];
  
    getAllUsers.mockResolvedValue(users);
    deleteUser.mockResolvedValueOnce();
  
    const { getByTestId } = render(<Admin />);
    
    await waitFor(() => expect(getAllUsers).toHaveBeenCalledTimes(1));
  
    console.log('Users:', users);
  
    const userElement = getByTestId(`user-${userId}`);
    console.log('User element:', userElement);
  
    if (userElement) {
      const deleteButton = userElement.querySelector('button');
      console.log('Delete button:', deleteButton);
      
      if (deleteButton) {
        fireEvent.click(deleteButton);
      } else {
        console.error('Delete button not found.');
      }
    } else {
      console.error('User element not found.');
    }
  
    await waitFor(() => {
      expect(deleteUser).toHaveBeenCalledTimes(1);
      expect(deleteUser).toHaveBeenCalledWith(userId, token);
    });
  
    await waitFor(() => {
      expect(queryByTestId(`user-${userId}`)).not.toBeInTheDocument();
    });
  });
  
});
