import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import Admin from '../Admin'; 
import { getAllUsers, deleteUser } from '../../api/adminApi'; 

jest.mock('../../api/adminApi'); 

describe('Admin component', () => {
  beforeEach(() => {
    getAllUsers.mockResolvedValue([
      { id: 1, name: 'User 1', username: 'user1', email: 'user1@example.com', admin: true },
      { id: 2, name: 'User 2', username: 'user2', email: 'user2@example.com', admin: false }
    ]);
  });

  test('renders users correctly', async () => {
    render(<Admin />);

    await waitFor(() => {
      expect(screen.getByText('User 1')).toBeInTheDocument();
      expect(screen.getByText('user1')).toBeInTheDocument();
      expect(screen.getByText('user1@example.com')).toBeInTheDocument();
      expect(screen.getByText('Yes')).toBeInTheDocument(); 

      expect(screen.getByText('User 2')).toBeInTheDocument();
      expect(screen.getByText('user2')).toBeInTheDocument();
      expect(screen.getByText('user2@example.com')).toBeInTheDocument();
      expect(screen.getByText('No')).toBeInTheDocument(); 
    });
  });

  test('deletes user correctly', async () => {
    deleteUser.mockResolvedValueOnce();
    render(<Admin />);
  
    await waitFor(() => {
      fireEvent.click(screen.getAllByText('Delete')[0]); 
    });
  
    await waitFor(() => {
      expect(deleteUser).toHaveBeenCalledWith(1, expect.any(String)); 
      expect(screen.queryByText('User 1')).not.toBeInTheDocument(); 
    });
  });  

});
