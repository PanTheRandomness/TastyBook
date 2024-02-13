import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import { AddRecipe, RecipeKeywords, RecipeSteps, RecipeIngredients, IngredientDialog, StepDialog, KeywordDialog } from '../AddRecipePage';

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

describe('RecipeSteps component', () => {
    test('opens StepDialog when "Add step" button is clicked', async () => {
        const { getByText, queryByText } = render(<RecipeSteps steps={[]} />);
        
        fireEvent.click(getByText('Add step'));
    
        await waitFor(() => {
            expect(queryByText('Type instructions:')).toBeInTheDocument();
        });
    });
  
    test('adds new step to list when saved in StepDialog', async () => {
        const { getByText, getByLabelText, getByTestId } = render(
            <div>
                <RecipeSteps steps={[]} />
                <StepDialog isOpen={true} onClose={() => {}} onAdd={() => {}} />
            </div>
        );
    
        fireEvent.change(getByLabelText('Type instructions:'), { target: { value: 'Preheat oven to 350°F' } });
        fireEvent.click(getByText('Save Step'));
    
        await waitFor(() => {
            expect(getByTestId('step-0')).toHaveTextContent('Preheat oven to 350°F');
        });
    });
  
    test('opens StepDialog with correct value when "Edit step" button is clicked', async () => {
        const { getByText, getByLabelText } = render(
            <div>
                <RecipeSteps steps={['Preheat oven to 350°F']} />
                <StepDialog isOpen={false} onClose={() => {}} onAdd={() => {}} />
            </div>
        );
    
        fireEvent.click(getByText('Edit step'));
    
        await waitFor(() => {
            expect(getByLabelText('Type instructions:')).toHaveValue('Preheat oven to 350°F');
        });
    });

    test('edits and updates step in RecipeSteps component', async () => {
        const { getByText, getByLabelText, getByTestId } = render(
            <div>
                <RecipeSteps steps={['Preheat oven to 350°F']} />
                <StepDialog isOpen={true} onClose={() => {}} onSaveEdited={() => {}} editingStep={true} text="Preheat oven to 350°F" />
            </div>
        );
    
        fireEvent.change(getByLabelText('Type instructions:'), { target: { value: 'Preheat oven to 375°F' } });
        fireEvent.click(getByText('Save Step'));
    
        await waitFor(() => {
            expect(getByTestId('step-0')).toHaveTextContent('Preheat oven to 375°F');
        });
    });

    test('removes step from list when "Remove step" button is clicked', async () => {
        const { getByText, queryByText } = render(
            <RecipeSteps steps={['Preheat oven to 375°F']} />
        );
        
        fireEvent.click(getByText('Remove step'));
      
        await waitFor(() => {
            expect(queryByText('Preheat oven to 375°F')).not.toBeInTheDocument();
        });
    });
});

describe('RecipeKeywords component', () => {
    test('opens KeywordDialog when "Add keyword" button is clicked', async () => {
        const { getByText, queryByText } = render(<RecipeKeywords keywords={[]} />);
        
        fireEvent.click(getByText('Add keyword'));
    
        await waitFor(() => {
            expect(queryByText('Type keyword:')).toBeInTheDocument();
        });
    });
  
    test('adds new keyword to list when saved in KeywordDialog', async () => {
        const { getByText, getByLabelText, getByTestId } = render(
            <div>
                <RecipeKeywords keywords={[]} />
                <KeywordDialog isOpen={true} onClose={() => {}} onAdd={() => {}} />
            </div>
        );
  
        fireEvent.change(getByLabelText('Type keyword:'), { target: { value: 'Baking' } });
        fireEvent.click(getByText('Add Keyword'));
    
        await waitFor(() => {
            expect(getByTestId('keyword-0')).toHaveTextContent('Baking');
        });
    });
  
    test('opens KeywordDialog with correct value when "Edit keyword" button is clicked', async () => {
        const { getByText, getByLabelText } = render(
            <div>
                <RecipeKeywords keywords={['Baking']} />
                <KeywordDialog isOpen={false} onClose={() => {}} onAdd={() => {}} />
            </div>
        );
    
        fireEvent.click(getByText('Edit keyword'));
    
        await waitFor(() => {
            expect(getByLabelText('Type keyword:')).toHaveValue('Baking');
        });
    });

    test('edits and updates keyword in RecipeKeywords component', async () => {
        const { getByText, getByLabelText, getByTestId } = render(
            <div>
                <RecipeKeywords keywords={['Baking']} />
                <KeywordDialog isOpen={true} onClose={() => {}} onSaveEdited={() => {}} editingKeyword={true} w="Baking" />
            </div>
        );
    
        fireEvent.change(getByLabelText('Type keyword:'), { target: { value: 'Cooking' } });
        fireEvent.click(getByText('Save Keyword'));
    
        await waitFor(() => {
            expect(getByTestId('keyword-0')).toHaveTextContent('Cooking');
        });
    });
  
    test('removes keyword from list when "Remove keyword" button is clicked', async () => {
        const { getByText, queryByText } = render(
            <RecipeKeywords keywords={['Cooking']} />
        );
        
        fireEvent.click(getByText('Remove keyword'));
    
        await waitFor(() => {
            expect(queryByText('Cooking')).not.toBeInTheDocument();
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