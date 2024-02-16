import React from 'react';
import { render, fireEvent, waitFor, queryByTestId } from '@testing-library/react';
import { RecipeIngredients, IngredientDialog } from '../../addRecipeComponents/RecipeIngredients';

describe('RecipeIngredients component', () => {
    test('opens IngredientDialog when "Add ingredient" button is clicked', async () => {
        const { queryByTestId, getByTestId } = render(
        <div>
            <RecipeIngredients ingredients={[]} />
            <IngredientDialog isOpen={false} />
        </div>
        )

        fireEvent.click(getByTestId('addIngredient-button'));
    
        await waitFor(() => {
            expect(queryByTestId('ingredient-dialog-title')).toBeInTheDocument();
        });
        
    });
  
    test('calls onAdd when new ingredient is added in IngredientDialog', async () => {
        const onAdd = jest.fn();
        const qt = "1";
        const unit = "lbs";
        const ing = "Potato";
        const { getByTestId } = render(
            <div>
                <RecipeIngredients ingredients={[]} />
                <IngredientDialog isOpen={true} onAdd={onAdd} qt={qt} unit={unit} ing={ing} />
            </div>
        );
  
        fireEvent.click(getByTestId('addIngredient-button'));
    
        await waitFor(() => {
            expect(onAdd).toHaveBeenCalledWith("1", "lbs", "Potato");
        });
    });

    test('edits and updates ingredient in dialog component', async () => {
        const onQtChange = jest.fn();
        const onUnitChange = jest.fn();
        const onIngChange = jest.fn();
        const { getByTestId } = render(
            <div>
                <IngredientDialog
                isOpen={true}
                onSaveEdited={() => {}}
                editingIngredient={true}
                qt={1}
                unit="cup"
                ing="Flour"
                onQtChange={onQtChange}
                onUnitChange={onUnitChange}
                onIngChange={onIngChange} />
            </div>
        );
    
        // Simulate editing values and saving
        fireEvent.change(getByTestId('quantityInput'), { target: { value: '2' } });
        fireEvent.change(getByTestId('unitInput'), { target: { value: 'lbs' } });
        fireEvent.change(getByTestId('ingredientInput'), { target: { value: 'Whole Wheat Flour' } });
        fireEvent.click(getByTestId('saveIngredient-button')); // Click the "Save Ingredient" button
    
        // Wait for the ingredient to be updated in the list
        await waitFor(() => {
            expect(onIngChange).toHaveBeenCalledWith('Whole Wheat Flour');
            expect(onQtChange).toHaveBeenCalledWith('2');
            expect(onUnitChange).toHaveBeenCalledWith('lbs')
        });
    });

    test('calls onRecome fwhen "Remove ingredient" button is clicked', async () => {
        const onRemove = jest.fn();
        const { getByText } = render(
            <RecipeIngredients ingredients={[{ quantity: '1 cup', unit: 'grams', name: 'Flour' }]} onRemove={onRemove} />
        );
        
        fireEvent.click(getByText('Remove ingredient')); 
    
        await waitFor(() => {
            expect(onRemove).toHaveBeenCalledWith({ quantity: '1 cup', unit: 'grams', name: 'Flour' });
        });
    
        
    });
});
