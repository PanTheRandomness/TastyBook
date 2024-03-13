import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Search from '../search';

describe('Search component', () => {
  test('renders search input field', () => {
    render(<Search />);
    const searchInputLabel = screen.getByText('Search by name or ingredient:');
    expect(searchInputLabel).toBeInTheDocument();
  });

 /* test('displays search results correctly.', async () => {
    render(<Search />);
    const searchInput = screen.getByLabelText('Search by name or ingredient:');
    fireEvent.change(searchInput, { target: { value: 'pasta' } });
    fireEvent.click(screen.getByRole('button'));
    await waitFor(() => {
      const searchResults = screen.getByText(/Search Results/);
      expect(searchResults).toBeInTheDocument();
    });
  }); */
  

  test('displays error message when no recipes found', async () => {
    render(<Search />);
    const searchInput = screen.getByLabelText('Search by name or ingredient:');
    fireEvent.change(searchInput, { target: { value: 'nonexistent' } });
    fireEvent.click(screen.getByRole('button'));
    await waitFor(() => {
      const errorMessage = screen.getByText('No recipes found.');
      expect(errorMessage).toBeInTheDocument();
    });
  });
});
