import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import { RecipeSteps, StepDialog } from '../../addRecipeComponents/RecipeSteps';

describe('RecipeSteps component', () => {
    test('opens StepDialog when "Add step" button is clicked', async () => {
        const { getByText, queryByText } = render(
            <div>
                <RecipeSteps steps={[]} />
                <StepDialog isOpen={false} />
            </div>
        );
        
        fireEvent.click(getByText('Add Step'));
    
        await waitFor(() => {
            expect(queryByText('Type instructions:')).toBeInTheDocument();
        });
    });
  
    test('calls onAdd when new step is added in StepDialog', async () => {
        const onAdd = jest.fn();
        const { getByText } = render(
            <div>
                <RecipeSteps steps={[]} />
                <StepDialog isOpen={true} onAdd={onAdd} text={'Preheat oven to 350°F' } />
            </div>
        );
    
        fireEvent.click(getByText('Add Step'));
    
        await waitFor(() => {
            expect(onAdd).toHaveBeenCalledWith('Preheat oven to 350°F');
        });
    });
  
    test('opens StepDialog with correct value when "Edit step" button is clicked', async () => {
        const onEdit = jest.fn();
        const { getByText, getByLabelText } = render(
            <div>
                <RecipeSteps steps={['Preheat oven to 350°F']} onEdit={onEdit} />
                <StepDialog isOpen={false} text={'Preheat oven to 350°F'} />
            </div>
        );
    
        fireEvent.click(getByText('Edit step'));
    
        await waitFor(() => {
            expect(getByLabelText('Type instructions:')).toHaveValue('Preheat oven to 350°F');
        });
    });

    test('edits and updates step in dialog component', async () => {
        const onTextChange = jest.fn();
        const { getByText, getByLabelText } = render(
            <div>
                <StepDialog isOpen={true} editingStep={true} onSaveEdited={() => {}} text="Preheat oven to 350°F" onTextChange={onTextChange} />
            </div>
        );
    
        fireEvent.change(getByLabelText('Type instructions:'), { target: { value: 'Preheat oven to 375°F' } });
        fireEvent.click(getByText('Save Step'));
    
        await waitFor(() => {
            expect(onTextChange).toHaveBeenCalledWith('Preheat oven to 375°F');
        });
    });

    test('calls onRemove when "Remove step" button is clicked', async () => {
        const onRemove = jest.fn();
        const { getByText } = render(
            <RecipeSteps steps={['Preheat oven to 375°F']} onRemove={onRemove} />
        );
        
        fireEvent.click(getByText('Remove step'));
      
        await waitFor(() => {
            expect(onRemove).toHaveBeenCalledWith('Preheat oven to 375°F');
        });
    });
});