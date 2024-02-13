import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Admin from '../Admin'; 
import { getAllUsers, deleteUser, updateUser } from '../../api/adminApi'; 

jest.mock('../../api/adminApi'); 

describe('Admin component', () => {
  beforeEach(() => {
    getAllUsers.mockResolvedValue([
      { id: 1, name: 'User 1', username: 'user1', email: 'user1@example.com' },
      { id: 2, name: 'User 2', username: 'user2', email: 'user2@example.com' }
    ]);
  });

  test('renders users correctly', async () => {
    render(<Admin />);

    await waitFor(() => {
      expect(screen.getByText('User 1')).toBeInTheDocument();
      expect(screen.getByText('user1')).toBeInTheDocument();
      expect(screen.getByText('user1@example.com')).toBeInTheDocument();

      expect(screen.getByText('User 2')).toBeInTheDocument();
      expect(screen.getByText('user2')).toBeInTheDocument();
      expect(screen.getByText('user2@example.com')).toBeInTheDocument();
    });
  });

  test('deletes user correctly', async () => {
    deleteUser.mockResolvedValueOnce();
    render(<Admin />);

    fireEvent.click(screen.getByText('Delete'));

    await waitFor(() => {
      expect(deleteUser).toHaveBeenCalledWith(1, expect.any(String));
      expect(screen.queryByText('User 1')).not.toBeInTheDocument();
    });
  });

  test('edits user correctly', async () => {
    updateUser.mockResolvedValueOnce({ id: 1, name: 'Updated User', username: 'updateduser', email: 'updateduser@example.com' });
    render(<Admin />);

    fireEvent.click(screen.getByText('Edit'));

    fireEvent.change(screen.getByLabelText('Name'), { target: { value: 'Updated User' } });
    fireEvent.change(screen.getByLabelText('Username'), { target: { value: 'updateduser' } });
    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'updateduser@example.com' } });

    fireEvent.click(screen.getByText('Save'));

    await waitFor(() => {
      expect(updateUser).toHaveBeenCalledWith(1, { name: 'Updated User', username: 'updateduser', email: 'updateduser@example.com' }, expect.any(String));
      expect(screen.getByText('Updated User')).toBeInTheDocument();
      expect(screen.getByText('updateduser')).toBeInTheDocument();
      expect(screen.getByText('updateduser@example.com')).toBeInTheDocument();
    });
  });
});
