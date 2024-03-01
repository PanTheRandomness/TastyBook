import React from 'react';
import * as router from 'react-router';
import { render, fireEvent, waitFor } from '@testing-library/react';
import { AddRecipe, SaveDialog } from '../AddRecipePage';

describe('AddRecipe component', () => {
    const navigate = jest.fn()

    beforeEach(() => {
        jest.spyOn(router, 'useNavigate').mockImplementation(() => navigate)
    })

    test('input fields can be filled with name, duration, and description', async () => {
        const { getByTestId } = render(<AddRecipe addRecipeRoute={() => {}} />);
      
        const nameInput = getByTestId('recipeNameInput');
        const durationHInput = getByTestId('recipeHoursInput');
        const durationMinInput = getByTestId('recipeMinutesInput');
        const descriptionInput = getByTestId('recipeDescriptionInput');
    
        fireEvent.change(nameInput, { target: { value: 'Test Recipe' } });
        fireEvent.change(durationHInput, { target: { value: '2' } });
        fireEvent.change(durationMinInput, { target: { value: '30' } });
        fireEvent.change(descriptionInput, { target: { value: 'Test Description' } });
    
        await waitFor(() => {
            expect(nameInput.value).toBe('Test Recipe');
            expect(durationHInput.value).toBe('2');
            expect(durationMinInput.value).toBe('30');
            expect(descriptionInput.value).toBe('Test Description');
        });
    });
});

describe('Recipe submission eligibility tests', () => {
    test('disables "Save & Post Recipe" button when required fields are missing', () => {
        const { getByText, getByTestId } = render(<AddRecipe />);
    
        // Selecting elements and setting values to simulate missing required fields
        const nameInput = getByTestId('recipeNameInput');
        const descriptionInput = getByTestId('recipeDescriptionInput');
        const saveButton = getByText('Save & Post Recipe');
    
        fireEvent.change(nameInput, { target: { value: 'Test Recipe' } });
        fireEvent.change(descriptionInput, { target: { value: 'Test Description' } });
    
        // "Save & Post Recipe" button should still be disabled due to missing required fields
        expect(saveButton).toBeDisabled();
    });
});

/*describe('Editing recipe tests', () =>{
    test('displays correct information when loading recipe for editing', async () => {

    });
});*/