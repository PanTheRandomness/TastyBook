import React from 'react';
import { render, waitFor, screen } from '@testing-library/react';
import RecipeList from '../RecipeList';

jest.mock('../api/favouriteApi', () => ({
  getFavourites: jest.fn(() => Promise.resolve([
    { id: 1, title: 'Pasta Carbonara' },
    { id: 2, title: 'Chicken Curry' },
  ])),
}));

describe('RecipeList component', () => {
  it('renders loading state initially', () => {
    render(<RecipeList />);
    expect(screen.getByText('My Favourites:')).toBeInTheDocument();
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('renders favourite recipes', async () => {
    render(<RecipeList />);
    await waitFor(() => {
      expect(screen.getByText('Pasta Carbonara')).toBeInTheDocument();
      expect(screen.getByText('Chicken Curry')).toBeInTheDocument();
    });
  });

  it('renders no favourite recipes found message', async () => {
    jest.spyOn(window, 'fetch').mockImplementationOnce(() =>
      Promise.resolve({ ok: true, json: () => Promise.resolve([]) })
    );

    render(<RecipeList />);
    await waitFor(() => {
      expect(screen.getByText('No favourite recipes found.')).toBeInTheDocument();
    });
  });

  it('renders error message if fetching fails', async () => {
    jest.spyOn(window, 'fetch').mockImplementationOnce(() =>
      Promise.reject(new Error('Failed to fetch'))
    );

    render(<RecipeList />);
    await waitFor(() => {
      expect(screen.getByText('Error fetching favorites')).toBeInTheDocument();
    });
  });
});
