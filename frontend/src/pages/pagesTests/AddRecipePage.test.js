import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import { AddRecipe } from '../AddRecipePage';

describe('AddRecipe component', () => {
    test('input fields can be filled with name, duration, and description', async () => {
        const { getByLabelText } = render(<AddRecipe addRecipeRoute={() => {}} />);
      
        const nameInput = getByLabelText('Recipe name:');
        const durationHInput = getByLabelText('Recipe duration:').querySelector('input[type="number"][min="0"][max="200"]');
        const durationMinInput = getByLabelText('Recipe duration:').querySelector('input[type="number"][min="0"][max="59"]');
        const descriptionInput = getByLabelText('Recipe description:');
    
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
  
    test('duration fields only accept numeric input within allowed ranges', async () => {
        const { getByLabelText } = render(<AddRecipe addRecipeRoute={() => {}} />);
        
        const durationHInput = getByLabelText('Recipe duration:').querySelector('input[type="number"][min="0"][max="200"]');
        const durationMinInput = getByLabelText('Recipe duration:').querySelector('input[type="number"][min="0"][max="59"]');
    
        fireEvent.change(durationHInput, { target: { value: '-1' } });
        fireEvent.change(durationMinInput, { target: { value: '60' } });
    
        await waitFor(() => {
            expect(durationHInput.value).toBe('1');
            expect(durationMinInput.value).toBe('59');
        });
    });
});

describe('Recipe submission eligibility tests', () => {
    test('disables "Save & Post Recipe" button when required fields are missing', () => {
        const { getByText, getByLabelText } = render(<AddRecipe />);
    
        // Selecting elements and setting values to simulate missing required fields
        const nameInput = getByLabelText('Recipe name:');
        const descriptionTextarea = getByLabelText('Recipe description:');
        const saveButton = getByText('Save & Post Recipe');
    
        fireEvent.change(nameInput, { target: { value: 'Test Recipe' } });
        fireEvent.change(descriptionTextarea, { target: { value: 'Test Description' } });
    
        // "Save & Post Recipe" button should still be disabled due to missing required fields
        expect(saveButton).toBeDisabled();
    });
  
    test('enables "Save & Post Recipe" button when all required fields are filled', () => {
        const { getByText, getByLabelText, queryByText } = render(<AddRecipe />);
    
        // Selecting elements and setting values to simulate filling all required fields
        const nameInput = getByLabelText('Recipe name:');
        const descriptionTextarea = getByLabelText('Recipe description:');
        const durationHInput = getByLabelText('Recipe duration:');
        const durationMinInput = getByLabelText('Recipe duration:');
        const saveButton = getByText('Save & Post Recipe');
    
        fireEvent.change(nameInput, { target: { value: 'Test Recipe' } });
        fireEvent.change(descriptionTextarea, { target: { value: 'Test Description' } });
        fireEvent.change(durationHInput, { target: { value: 1 } });
        fireEvent.change(durationMinInput, { target: { value: 30 } });
    
        // Simulating opening and filling the ingredient dialog
        fireEvent.click(getByText('Add ingredient'));
    
        // Modifying the following lines according to your dialog's content
        const quantityInput = getByTestId('quantityInput');
        const unitInput = getByTestId('unitInput');
        const ingredientInput = getByTestId('ingredientInput');
        fireEvent.change(quantityInput, { target: { value: 100 } });
        fireEvent.change(unitInput, { target: { value: 'grams' } });
        fireEvent.change(ingredientInput, { target: { value: 'Test Ingredient' } });
    
        fireEvent.click(queryByText('Add Ingredient')); // Make sure to handle button text properly
    
        // Simulating opening and filling the step dialog
        fireEvent.click(getByText('Add Step'));
    
        // Modifying the following lines according to your dialog's content
        const stepTextInput = getByLabelText('Type instructions:');
        fireEvent.change(stepTextInput, { target: { value: 'Test Step' } });
    
        fireEvent.click(queryByText('Add Step')); // Make sure to handle button text properly
    
        // Simulating opening and filling the keyword dialog
        fireEvent.click(getByText('Add keyword'));
    
        // Modifying the following lines according to your dialog's content
        const keywordInput = getByLabelText('Type keyword:');
        fireEvent.change(keywordInput, { target: { value: 'Test Keyword' } });
    
        fireEvent.click(queryByText('Add Keyword')); // Make sure to handle button text properly
    
        // "Save & Post Recipe" button should be enabled now
        expect(saveButton).toBeEnabled();
    });
});