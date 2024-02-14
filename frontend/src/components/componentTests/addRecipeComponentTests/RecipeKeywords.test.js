import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import { RecipeKeywords, KeywordDialog } from '../../addRecipeComponents/RecipeKeywords';

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