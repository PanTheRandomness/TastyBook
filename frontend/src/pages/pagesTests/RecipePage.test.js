import * as router from 'react-router';
import { render, fireEvent, waitFor, screen} from '@testing-library/react';
import { Recipe } from '../RecipePage';

describe('RecipePage component', () => {
    const navigate = jest.fn()

    beforeEach(() => {
        jest.spyOn(router, 'useNavigate').mockImplementation(() => navigate)
    })

    test('renders recipe page with correct data', async () => {
        // Määritellään mock-resepti
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
            steps: ['Sekoita ainekset', 'Paista'],
            keywords: ['testi', 'ruoka']
        };
      
      
        // Odotetaan, että resepti latautuu ja sen tiedot näkyvät
        await waitFor(() => {
            const headerElement = screen.getByRole(mockRecipe.header);
            expect(headerElement).toBeInTheDocument();
        
            const descriptionElement = screen.getByText(mockRecipe.description);
            expect(descriptionElement).toBeInTheDocument();
        
            const usernameElement = screen.getByText(`Created By: ${mockRecipe.username}`);
            expect(usernameElement).toBeInTheDocument();
        
            const durationElement = screen.getByText(`Duration: ${mockRecipe.durationHours}h ${mockRecipe.durationMinutes}min`);
            expect(durationElement).toBeInTheDocument();
        
            mockRecipe.ingredients.forEach(ingredient => {
                const ingredientElement = screen.getByText(ingredient.name);
                expect(ingredientElement).toBeInTheDocument();
            });
        
            mockRecipe.steps.forEach(step => {
                const stepElement = screen.getByText(step);
                expect(stepElement).toBeInTheDocument();
            });
      
            mockRecipe.keywords.forEach(keyword => {
                const keywordElement = screen.getByText(keyword);
                expect(keywordElement).toBeInTheDocument();
            });
        });
    });

    test('deletes recipe', async () =>{
    
        

        // Odota, että "Delete" -painike löytyy ja klikkaa sitä
        const deleteButton = screen.getByText('Delete');
        fireEvent.click(deleteButton);

        // Odota, että navigointi on kutsuttu oikein
        await waitFor(() => {
            expect(navigate).toHaveBeenCalledWith('/');
        });

    });

    test('starts editing recipe', async () =>{
        // Odota, että "Edit" -painike löytyy ja klikkaa sitä
        const editButton = screen.getByText('Edit');
        fireEvent.click(editButton);

        // Odota, että navigointi on kutsuttu oikein
        await waitFor(() => {
            expect(navigate).toHaveBeenCalledWith('/editrecipe/:id');
        });

    });
});