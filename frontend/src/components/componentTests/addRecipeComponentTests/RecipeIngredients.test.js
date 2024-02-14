import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import { RecipeIngredients, IngredientDialog } from '../../addRecipeComponents/RecipeIngredients';

describe('RecipeIngredients component', () => {
    test('opens IngredientDialog when "Add ingredient" button is clicked', async () => {
        const { getByText, queryByText } = render(<RecipeIngredients ingredients={[]} />);
        
        fireEvent.click(getByText('Add ingredient'));
    
        await waitFor(() => {
            expect(queryByText('Add ingredient')).toBeInTheDocument();
        });
    });
  
    test('adds new ingredient to list when saved in IngredientDialog', async () => {
        const { getByText, getByTestId } = render(
            <div>
                <RecipeIngredients ingredients={[]} />
                <IngredientDialog isOpen={true} onClose={() => {}} onAdd={() => {}} />
            </div>
        );
    
        fireEvent.change(getByTestId('quantityInput'), { target: { value: '2' } });
        fireEvent.change(getByTestId('unitInput'), { target: { value: 'cups' } });
        fireEvent.change(getByTestId('ingredientInput'), { target: { value: 'Flour' } });
        fireEvent.click(getByText('Save Ingredient'));
    
        await waitFor(() => {
            expect(getByTestId('ingredient-0')).toHaveTextContent('2 cups Flour');
        });
    });
  
    test('opens IngredientDialog with correct values when "Edit ingredient" button is clicked', async () => {
        const { getByText, getByTestId } = render(
            <div>
                <RecipeIngredients ingredients={[{ quantity: '1 cup', unit: 'sugar', name: 'Sugar' }]} />
                <IngredientDialog isOpen={false} onClose={() => {}} onAdd={() => {}} />
            </div>
        );
  
        fireEvent.click(getByText('Edit ingredient'));
    
        await waitFor(() => {
            expect(getByTestId('ingredient-dialog-title')).toHaveTextContent('Modify ingredient');
            expect(getByTestId('quantityInput')).toHaveValue('1');
            expect(getByTestId('unitInput')).toHaveValue('cup');
            expect(getByTestId('ingredientInput')).toHaveValue('Sugar');
        });
    });

    test('edits and updates ingredient in RecipeIngredients component', async () => {
        const { getByText, getByTestId } = render(
            <div>
                <RecipeIngredients ingredients={[{ quantity: '1 cup', unit: 'grams', name: 'Flour' }]} />
                <IngredientDialog isOpen={true} onClose={() => {}} onSaveEdited={() => {}} editingIngredient={true} qt={1} unit="cup" ing="Flour" />
            </div>
        );
    
        fireEvent.change(getByTestId('quantityInput'), { target: { value: '2' } });
        fireEvent.change(getByTestId('unitInput'), { target: { value: 'lbs' } });
        fireEvent.change(getByTestId('ingredientInput'), { target: { value: 'Whole Wheat Flour' } });
        fireEvent.click(getByText('Save Ingredient'));
    
        await waitFor(() => {
            expect(getByTestId('ingredient-0')).toHaveTextContent('2 lbs Whole Wheat Flour');
        });
    });

    test('removes ingredient from list when "Remove ingredient" button is clicked', async () => {
        const mockRemoveIngredient = jest.fn();
        const { getByText, queryByText } = render(
            <RecipeIngredients ingredients={[{ quantity: '1 cup', unit: 'grams', name: 'Flour' }]} onRemove={mockRemoveIngredient} />
        );
        
        fireEvent.click(getByText('Remove ingredient'));
    
        await waitFor(() => {
            expect(queryByText('Flour')).not.toBeInTheDocument();
        });
    
        expect(mockRemoveIngredient).toHaveBeenCalled();
    });
});