import React from 'react';
import { render, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import FrontPage from '../FrontPage';
import { getRecipeViews } from '../../api/recipeApi'; // Import your API function

jest.mock('../../api/recipeApi'); // Mocking the API function

describe('FrontPage component', () => {
    beforeEach(() => {
        getRecipeViews.mockReset(); // Reset mock function before each test
    });

    it('renders loading message and fetches recipes on mount', async () => {
        const mockRecipes = [{ id: 1, header: 'Recipe 1' }, { id: 2, header: 'Recipe 2' }];
        getRecipeViews.mockResolvedValueOnce({ recipes: mockRecipes, loggedIn: true });

        const { getByText } = render(
            <BrowserRouter>
                <FrontPage />
            </BrowserRouter>
        );

        expect(getByText("Loading...")).toBeInTheDocument();

        await waitFor(() => expect(getByText('Tasty Book Recipes:')).toBeInTheDocument());
        await waitFor(() => expect(getByText('Recipe 1')).toBeInTheDocument());
    });

    it('displays error message if fetching recipes fails', async () => {
        getRecipeViews.mockRejectedValueOnce(new Error('Failed to fetch recipes'));

        const { getByText } = render(
            <BrowserRouter>
                <FrontPage />
            </BrowserRouter>
        );

        await waitFor(() => expect(getByText('Error loading recipes')).toBeInTheDocument());
    });

    it('calls onLogout if user is not logged in', async () => {
        getRecipeViews.mockResolvedValueOnce({ recipes: [], loggedIn: false });
        const mockOnLogout = jest.fn();

        render(
            <BrowserRouter>
                <FrontPage onLogout={mockOnLogout} />
            </BrowserRouter>
        );

        await waitFor(() => expect(mockOnLogout).toHaveBeenCalledTimes(1));
    });
});