import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Search from '../search';

describe('Search component', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('renders search inputs and button', () => {
    render(<Search />);
    const keywordButton = screen.getByText('Search by keyword');
    const ingredientButton = screen.getByText('Search by ingredient');
    const usernameButton = screen.getByText('Search by username');
    const searchButton = screen.getByText('Search');
    
    expect(keywordButton).toBeInTheDocument();
    expect(ingredientButton).toBeInTheDocument();
    expect(usernameButton).toBeInTheDocument();
    expect(searchButton).toBeInTheDocument();
  });

  it('allows user to search by keyword', async () => {
    const mockFetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ recipes: [] }),
    });
    jest.spyOn(window, 'fetch').mockImplementation(mockFetch);

    render(<Search />);
    const keywordButton = screen.getByText('Search by keyword');
    fireEvent.click(keywordButton);
    const keywordInput = screen.getByLabelText('Keyword:');
    const searchButton = screen.getByText('Search');
    fireEvent.change(keywordInput, { target: { value: 'chicken' } });
    fireEvent.click(searchButton);

    await waitFor(() => {
      expect(screen.getByText('Searching...')).toBeInTheDocument();
    });

    expect(mockFetch).toHaveBeenCalledWith(expect.stringContaining('keyword=chicken'), expect.any(Object));
  });

  it('allows user to search by ingredient', async () => {
    const mockFetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ recipes: [] }),
    });
    jest.spyOn(window, 'fetch').mockImplementation(mockFetch);

    render(<Search />);
    const ingredientButton = screen.getByText('Search by ingredient');
    fireEvent.click(ingredientButton);
    const ingredientInput = screen.getByLabelText('Ingredient:');
    const searchButton = screen.getByText('Search');
    fireEvent.change(ingredientInput, { target: { value: 'tomato' } });
    fireEvent.click(searchButton);

    await waitFor(() => {
      expect(screen.getByText('Searching...')).toBeInTheDocument();
    });

    expect(mockFetch).toHaveBeenCalledWith(expect.stringContaining('ingredient=tomato'), expect.any(Object));
  });

  it('allows user to search by username', async () => {
    const mockFetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ recipes: [] }),
    });
    jest.spyOn(window, 'fetch').mockImplementation(mockFetch);

    render(<Search />);
    const usernameButton = screen.getByText('Search by username');
    fireEvent.click(usernameButton);
    const usernameInput = screen.getByLabelText('Username:');
    const searchButton = screen.getByText('Search');
    fireEvent.change(usernameInput, { target: { value: 'john_doe' } });
    fireEvent.click(searchButton);

    await waitFor(() => {
      expect(screen.getByText('Searching...')).toBeInTheDocument();
    });

    expect(mockFetch).toHaveBeenCalledWith(expect.stringContaining('username=john_doe'), expect.any(Object));
  });

  it('displays error message if no recipes found', async () => {
    const mockFetch = jest.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => ({ recipes: [] }),
    });
    jest.spyOn(window, 'fetch').mockImplementation(mockFetch);

    render(<Search />);
    const searchButton = screen.getByText('Search');
    fireEvent.click(searchButton);

    await waitFor(() => {
      expect(screen.getByText('Searching...')).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(screen.getByText('No recipes found.')).toBeInTheDocument();
    });
  });

  it('displays error message if error occurs during search', async () => {
    const mockFetch = jest.fn().mockRejectedValueOnce(new Error('Failed to fetch recipes'));
    jest.spyOn(window, 'fetch').mockImplementation(mockFetch);

    render(<Search />);
    const searchButton = screen.getByText('Search');
    fireEvent.click(searchButton);

    await waitFor(() => {
      expect(screen.getByText('Searching...')).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(screen.getByText('Error searching recipes. Please try again later.')).toBeInTheDocument();
    });
  });
});
