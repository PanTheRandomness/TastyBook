import React from 'react';
import { render, waitFor, screen } from '@testing-library/react';
import RecipeList from '../RecipeList';

jest.mock('../../api/favouriteApi');

  it('renders no favourite recipes found message', async () => {
    const { getFavourites } = require('../../api/favouriteApi');
    getFavourites.mockResolvedValueOnce([]);
    render(<RecipeList />);
    await waitFor(() => {
      expect(screen.getByText(/No favourite recipes found/i)).toBeInTheDocument();
    });
  });

