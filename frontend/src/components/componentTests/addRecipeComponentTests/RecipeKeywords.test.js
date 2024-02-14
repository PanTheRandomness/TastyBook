import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import { RecipeKeywords, KeywordDialog } from '../../addRecipeComponents/RecipeKeywords';

describe('RecipeKeywords component', () => {
    test('opens KeywordDialog when "Add keyword" button is clicked', async () => {
        const { queryByText, getByText } = render(
            <div>
                <RecipeKeywords keywords={[]} />
                <KeywordDialog isOpen={false} />
            </div>
        )
        
        fireEvent.click(getByText('Add Keyword'));
    
        await waitFor(() => {
            expect(queryByText('Type keyword:')).toBeInTheDocument();
        });
    });
  
    test('calls onAdd when new keyword is added in KeywordDialog', async () => {
        const onAdd = jest.fn();
        const { getByText } = render(
            <div>
                <RecipeKeywords keywords={[]} />
                <KeywordDialog isOpen={true} onAdd={onAdd} w={"Baking"} />
            </div>
        );
  
        fireEvent.click(getByText('Add Keyword'));
    
        await waitFor(() => {
            expect(onAdd).toHaveBeenCalledWith('Baking');
        });
    });
  
    test('opens KeywordDialog with correct value when "Edit keyword" button is clicked', async () => {
        const onEdit = jest.fn();
        const { getByText, getByLabelText } = render(
            <div>
                <RecipeKeywords keywords={['Baking']} onEdit={onEdit} />
                <KeywordDialog isOpen={false} w={"Baking"} />
            </div>
        );
    
        fireEvent.click(getByText('Edit keyword'));
    
        await waitFor(() => {
            expect(getByLabelText('Type keyword:')).toHaveValue('Baking');
        });
    });

    test('edits and updates keyword in dialog component', async () => {
        const onWChange = jest.fn();
        const { getByText, getByLabelText } = render(
            <div>
                <KeywordDialog isOpen={true} onSaveEdited={() => {}} editingKeyword={true} w="Baking" onWChange={onWChange} />
            </div>
        );
    
        fireEvent.change(getByLabelText('Type keyword:'), { target: { value: 'Cooking' } });
        fireEvent.click(getByText('Save Keyword'));
    
        await waitFor(() => {
            expect(onWChange).toHaveBeenCalledWith('Cooking');
        });
    });
  
    test('calls onRemove when "Remove keyword" button is clicked', async () => {
        const onRemove = jest.fn();
        const { getByText } = render(
            <RecipeKeywords keywords={['Cooking']} onRemove={onRemove} />
        );
        
        fireEvent.click(getByText('Remove keyword'));
    
        await waitFor(() => {
            expect(onRemove).toHaveBeenCalledWith('Cooking');
        });
    });
});