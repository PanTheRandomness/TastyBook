import * as router from 'react-router';
import { render, waitFor } from '@testing-library/react';
import { Recipe } from '../RecipePage';
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

    test('renders recipe page with correct data', async () => {
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
        const { getByText } = render(<Recipe route={'123'} />)

        // Odotetaan, että resepti latautuu ja sen tiedot näkyvät
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
        });
    });
});