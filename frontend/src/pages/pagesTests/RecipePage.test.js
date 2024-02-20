import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter, Route } from 'react-router-dom';
import { Recipe, RecipeHead, RecipeIngredients, RecipeSteps, EllipsisMenu } from '../RecipePage';

describe('RecipePage component', () => {
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
            steps: ['1. Sekoita ainekset', '2. Paista'],
            keywords: ['testi', 'ruoka']
        };
      
        // Renderöi reseptisivu
        render(
            //Ei löydä, miten testaisi?
            <MemoryRouter initialEntries={['/recipe/test']}>
                <Route path="/recipe/:route">
                <RecipePage />
                </Route>
            </MemoryRouter>
        );
      
        // Odotetaan, että resepti latautuu ja sen tiedot näkyvät
        await waitFor(() => {
            const headerElement = screen.getByText(mockRecipe.header);
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
});