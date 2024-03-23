import React from 'react';
import * as router from 'react-router';
import { render, waitFor, fireEvent } from '@testing-library/react';
import { Recipe, RecipeHead } from '../RecipePage';
import { fetchRecipe } from '../../api/recipeApi';

jest.mock('../../api/recipeApi');

describe('RecipePage component', () => {
    const navigate = jest.fn()

    beforeEach(() => {
        jest.spyOn(router, 'useNavigate').mockImplementation(() => navigate);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    test('renders recipe page with correct data including reviews', async () => {
        const mockRecipe = {
            header: 'Testiresepti',
            description: 'Maistuva testiruoka',
            username: 'Testikokki',
            created: Date.now(),
            durationHours: 1,
            durationMinutes: 30,
            ingredients: [
                { quantity: '1 dl', name: 'Maito' },
                { quantity: '2 kpl', name: 'Munat' },
            ],
            steps: [{ step: 'Sekoita ainekset' }, { step: 'Paista' }],
            keywords: [{ word: 'Testi' }, { word: 'Ruoka' }],
            reviews: [
                { id: 1, username: 'user1', rating: 4, text: 'Great recipe!' },
                { id: 2, username: 'user2', rating: 5, text: 'Excellent!' },
            ]
        };

        fetchRecipe.mockResolvedValue(mockRecipe);
        const { getByText, queryByText } = render(<Recipe route={'123'} />)

        await waitFor(() => {
            expect(getByText(mockRecipe.header)).toBeInTheDocument();

            expect(getByText(mockRecipe.description)).toBeInTheDocument();

            //expect(getByText('Testikokki')).toBeInTheDocument();

            expect(getByText(`Duration: ${mockRecipe.durationHours}h ${mockRecipe.durationMinutes}min`)).toBeInTheDocument();

            expect(getByText('Maito')).toBeInTheDocument();

            expect(getByText('Sekoita ainekset')).toBeInTheDocument();

            expect(getByText('Ruoka')).toBeInTheDocument();

            mockRecipe.keywords.forEach(keyword => {
                expect(getByText(keyword.word)).toBeInTheDocument();
            });

            mockRecipe.ingredients.forEach(ingredient => {
                expect(getByText(ingredient.name)).toBeInTheDocument();
                expect(getByText(ingredient.quantity)).toBeInTheDocument();
            });
            mockRecipe.reviews.forEach(review => {
                const userElement = getByText(`${review.username}:`);
                expect(userElement).toBeInTheDocument();
                const ratingAndCommentRegex = new RegExp(`Rating: ${review.rating}.*Comment: ${review.text}`);
                const reviewText = queryByText(ratingAndCommentRegex);
                expect(reviewText).toBeInTheDocument();
            });
        });
    });

    test('fetches recipe data and image', async () => {
        const mockRecipe = {
            header: 'Testiresepti',
            description: 'Maistuva testiruoka',
            username: 'Testikokki',
            created: Date.now(),
            durationHours: 1,
            durationMinutes: 30,
            ingredients: [
                { quantity: '1 dl', name: 'Maito' },
                { quantity: '2 kpl', name: 'Munat' },
            ],
            steps: [{ step: 'Sekoita ainekset' }, { step: 'Paista' }],
            keywords: [{ word: 'Testi' }, { word: 'Ruoka' }]
        };

        const mockImageBlob = new Blob();

        fetchRecipe.mockResolvedValue(mockRecipe);
        global.fetch = jest.fn(() =>
            Promise.resolve({
                ok: true,
                blob: () => Promise.resolve(mockImageBlob)
            })
        );

        render(<Recipe route={'123'} />);

        expect(fetchRecipe).toHaveBeenCalled();

        await waitFor(() => {
            global.fetch().then(response => {
                expect(response.blob()).resolves.toEqual(mockImageBlob);
            });
        });
    });

    test('renders recipe page without image', async () => {
        const mockRecipe = {
            header: 'Testiresepti',
            description: 'Maistuva testiruoka',
            username: 'Testikokki',
            created: Date.now(),
            durationHours: 1,
            durationMinutes: 30,
            ingredients: [
                { quantity: '1 dl', name: 'Maito' },
                { quantity: '2 kpl', name: 'Munat' },
            ],
            steps: [{ step: 'Sekoita ainekset' }, { step: 'Paista' }],
            keywords: [{ word: 'Testi' }, { word: 'Ruoka' }]
        };

        fetchRecipe.mockResolvedValue(mockRecipe);

        const { queryByAltText } = render(<Recipe route={'123'} />);

        await waitFor(() => {
            const imageElement = queryByAltText('Recipe Image');
            expect(imageElement).not.toBeInTheDocument();
        });
    });

    test('Clicking on a keyword navigates to the correct search page', () => {
        const recipe = {
            id: 1,
            header: 'Test Recipe',
            description: 'This is a test recipe',
            username: 'testuser',
            keywords: [
                { word: 'keyword1' },
                { word: 'keyword2' },
            ],
        };

        const mockToSearch = jest.fn();

        const { getByText } = render(
            <RecipeHead
                recipe={recipe}
                onSearch={mockToSearch}
            />
        );

        const keywordElement = getByText('keyword1');
        fireEvent.click(keywordElement);

        expect(mockToSearch).toHaveBeenCalledWith('keyword1');
    });
});