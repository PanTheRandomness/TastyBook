import React from 'react';
import * as router from 'react-router';
import { render, fireEvent, waitFor } from '@testing-library/react';
import { AddRecipe, SaveDialog } from '../AddRecipePage';

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => jest.fn()
}));

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

describe('SaveDialog tests', () => {
    test('opens and confirms SaveDialog', async () => {
        const onCloseMock = jest.fn();
        const onConfirmMock = jest.fn();

        const { getByText, getByTestId } = render(
            <SaveDialog isOpen={true} onClose={onCloseMock} onConfirm={onConfirmMock} title="Save Recipe" />
        );

        expect(getByText('Are you sure you want to save this recipe? TastyBook is not responsible for any copyright infringments or other violations contained in, or concerning this recipe. You will be able to modify the recipe later.')).toBeInTheDocument();

        fireEvent.click(getByTestId('confirm-button'));

        await waitFor(() => {
            expect(onConfirmMock).toHaveBeenCalled();
        });

        expect(onCloseMock).not.toHaveBeenCalled();
    });
});

jest.mock('../../api/recipeApi');

describe('Editing recipe tests', () =>{
    test('loads and displays recipe data correctly on component mount (editing recipe), opens savedialog after editing', async () => {
        const mockRecipe = {
            id: 335,
            header: 'Testiresepti',
            visibleToAll: 1,
            description: 'Testaava resepti',
            durationHours: 2,
            durationMinutes: 10,
            ingredients: [{ quantity: '1 dl', name: 'Jauho' }, { quantity: '5 dl', name: 'Vesi' }, { quantity: '3 kpl', name: 'Valkosipulin kynsi' }],
            steps: [{ step: 'Sekoita vesi ja jauho' }, { step: 'Murskaa kynnet' }, { step: 'Sekoita kynnet jauhoseoksen joukkoon' }, { step: 'Paista uunissa' }],
            keywords: [{ word: 'Testi' }, { word: 'Valkosipuli' }]
        };

        const fetchMock = jest.fn().mockResolvedValue({
            ok: true,
            json: () => Promise.resolve(mockRecipe)
        });

        global.fetch = fetchMock;

        const route = 'mockRoute';

        const { getByTestId, getByText } = render(<AddRecipe route={route} />);

        await waitFor(() => {
            expect(fetchMock).toHaveBeenCalledWith(`http://localhost:3004/api/recipe/${route}`, expect.any(Object));
        });

        await waitFor(() => {
            expect(getByTestId('recipeNameInput')).toHaveValue(mockRecipe.header);
            expect(getByTestId('recipeDescriptionInput')).toHaveValue(mockRecipe.description);
            expect(getByTestId('visibleInput')).toHaveAttribute('checked');
            expect(getByTestId('recipeHoursInput')).toHaveValue(mockRecipe.durationHours);
            expect(getByTestId('recipeMinutesInput')).toHaveValue(mockRecipe.durationMinutes);

            expect(getByTestId('recipeIngredients')).toBeInTheDocument();
            expect(getByTestId('recipeKeywords')).toBeInTheDocument();
            expect(getByTestId('recipeSteps')).toBeInTheDocument();

            const ingredientsContainer = getByTestId('recipeIngredients');
            const keywordsContainer = getByTestId('recipeKeywords');
            const stepsContainer = getByTestId('recipeSteps');

            expect(ingredientsContainer).toHaveTextContent('1 dl Jauho');
            expect(ingredientsContainer).toHaveTextContent('5 dl Vesi');
            expect(ingredientsContainer).toHaveTextContent('3 kpl Valkosipulin kynsi');

            expect(keywordsContainer).toHaveTextContent('Testi');
            expect(keywordsContainer).toHaveTextContent('Valkosipuli');

            expect(stepsContainer).toHaveTextContent('Sekoita vesi ja jauho');
            expect(stepsContainer).toHaveTextContent('Murskaa kynnet');
            expect(stepsContainer).toHaveTextContent('Sekoita kynnet jauhoseoksen joukkoon');
            expect(stepsContainer).toHaveTextContent('Paista uunissa');
        });

        const recipeNameInput = getByTestId('recipeNameInput');
        fireEvent.change(recipeNameInput, { target: { value: 'Uusi reseptin nimi' } });
        await waitFor(() => {
            expect(recipeNameInput.value).toBe('Uusi reseptin nimi');
        });

        const saveRecipeButton = getByText('Save Recipe');
        fireEvent.click(saveRecipeButton);

        await waitFor(() => {
            expect(getByText('Are you sure you want to save this recipe? TastyBook is not responsible for any copyright infringments or other violations contained in, or concerning this recipe. You will be able to modify the recipe later.')).toBeInTheDocument();
        });

        const confirmButton = getByTestId('confirm-button');
        fireEvent.click(confirmButton);

        /*Testataan muuttuivatko tiedot... meneekö integraatiotestiin?
        await waitFor(() => {
            expect(getByText('Uusi reseptin nimi')).toBeInTheDocument();
        });*/
    });
});