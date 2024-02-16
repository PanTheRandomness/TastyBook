import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import { RecipeIngredients, IngredientDialog } from '../../addRecipeComponents/RecipeIngredients';

describe('RecipeIngredients component', () => {
    test('opens IngredientDialog when "Add ingredient" button is clicked', async () => {
        const { queryByText, getByTestId } = render(
        <div>
            <RecipeIngredients ingredients={[]} />
            <IngredientDialog isOpen={true} editingIngredient={true} />
        </div>
        )

        fireEvent.click(getByTestId('addIngredient-button'));
    
        await waitFor(() => {
            expect(queryByText('Modify ingredient')).toBeInTheDocument();
        });
        
    });
  
    test('adds new ingredient to list when saved in IngredientDialog', async () => {

        const onAdd = jest.fn();
        const { getByText } = render(
            <div>
                <RecipeIngredients ingredients={[]} />
                <IngredientDialog isOpen={true} onAdd={onAdd} w={"ingredient-0"} />
            </div>
        );
  
        fireEvent.click(getByText('Add ingredient'));
    
        await waitFor(() => {
            expect(onAdd).toHaveBeenCalledWith('ingredient-0');
        });
    });

    test('edits and updates ingredient in RecipeIngredients component', async () => {
        const onWChange = jest.fn();
        const { getByText, getByTestId } = render(
            <div>
                <RecipeIngredients ingredients={[{ quantity: '1 cup', unit: 'grams', name: 'Flour' }]} onEdit={() => {}} onRemove={() => {}} />
                <IngredientDialog isOpen={true} onClose={() => {}} onSaveEdited={() => {}} editingIngredient={true} qt={1} unit="cup" ing="Flour" onWChange={onWChange} />
            </div>
        );
    
        // Simulate editing values and saving
        fireEvent.change(getByTestId('quantityInput'), { target: { value: '2' } });
        fireEvent.change(getByTestId('unitInput'), { target: { value: 'lbs' } });
        fireEvent.change(getByTestId('ingredientInput'), { target: { value: 'Whole Wheat Flour' } });
        fireEvent.click(getByTestId('saveIngredient-button')); // Click the "Save Ingredient" button
    
        // Wait for the ingredient to be updated in the list
        await waitFor(() => {
            expect(onWChange).toHaveBeenCalledWith('Whole Wheat Flour');
            expect(getByTestId('ingredient-0')).toHaveTextContent('2 lbs Whole Wheat Flour');
        });
    });

    test('removes ingredient from list when "Remove ingredient" button is clicked', async () => {
        const onRemove = jest.fn();
        const { getByText, queryByText } = render(
            <RecipeIngredients ingredients={[{ quantity: '1 cup', unit: 'grams', name: 'Flour' }]} onRemove={onRemove} />
        );
        
        fireEvent.click(getByText('Remove ingredient')); 
    
        await waitFor(() => {
            expect(onRemove).toHaveBeenCalledWith({ quantity: '1 cup', unit: 'grams', name: 'Flour' });
        });
    
        
    });
});
