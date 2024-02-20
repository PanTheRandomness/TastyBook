import React from 'react';
import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import RecipeView from '../recipeView';

describe('RecipeView component', () => {
    const recipe = {
        hash: 'recipeHash123',
        header: 'Delicious Recipe',
        username: 'testuser',
    };

    it('renders with username', () => {
        const { getByText } = render(
            <BrowserRouter>
                <RecipeView recipe={recipe} />
            </BrowserRouter>
        );

        expect(getByText('Delicious Recipe')).toBeInTheDocument();
        expect(getByText('By: testuser')).toBeInTheDocument();
    });

    it('renders with deleted user', () => {
        const deletedUserRecipe = { ...recipe, username: null };
        const { getByText } = render(
            <BrowserRouter>
                <RecipeView recipe={deletedUserRecipe} />
            </BrowserRouter>
        );

        expect(getByText('Delicious Recipe')).toBeInTheDocument();
        expect(getByText('By: Deleted user')).toBeInTheDocument();
    });
});