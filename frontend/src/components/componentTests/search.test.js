import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Search from '../search';

describe('Search component', () => {
    test('renders search input field', () => {
      render(<Search />);
      const searchInput = screen.getByLabelText('Search by name or ingredients:');
      expect(searchInput).toBeInTheDocument();
    });

  test('displays search results correctly', async () => {
    render(<Search />);
    const searchInput = screen.getByLabelText('Search by name or ingredients:');
    fireEvent.change(searchInput, { target: { value: 'pasta' } });
    fireEvent.click(screen.getByRole('button'));
    await waitFor(() => {
        expect(screen.getByText('No recipes found.')).toBeInTheDocument();
    });
  });

  test('displays error message when no recipes found', async () => {
    render(<Search />);
    const searchInput = screen.getByLabelText('Search by name or ingredients:');
    fireEvent.change(searchInput, { target: { value: 'nonexistent' } });
    fireEvent.click(screen.getByRole('button'));
    await waitFor(() => {
      expect(screen.getByText(/No recipes found/i)).toBeInTheDocument();
    });
  });
});
