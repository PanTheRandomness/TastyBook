import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import { RecipeSteps, StepDialog } from '../../addRecipeComponents/RecipeSteps';

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