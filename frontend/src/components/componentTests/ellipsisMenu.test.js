import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import EllipsisMenu from '../EllipsisMenu';
import { useUser } from '../../customHooks/useUser';
import * as router from 'react-router-dom';

jest.mock('../../customHooks/useUser'); // Mock useUser hook
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: jest.fn(),
}));

describe('EllipsisMenu component', () => {
    const mockUser = { username: 'testuser' };
    const mockCreator = 'testuser';
    const mockProps = {
        creator: mockCreator,
        onDelete: jest.fn(),
        route: 'recipeHash123'
    };

    beforeEach(() => {
        useUser.mockReturnValue(mockUser); // Mock the return value of useUser hook
    });

    test('renders menu options for the creator', () => {
        const { getByTestId, getByText } = render(<EllipsisMenu {...mockProps} />);
        
        fireEvent.click(getByTestId('ellipsis'));
        expect(getByText('Edit recipe')).toBeInTheDocument();
        expect(getByText('Delete recipe')).toBeInTheDocument();
    });

    test('closes menu when clicked outside', () => {
        const { getByText, queryByText, getByTestId } = render(<EllipsisMenu {...mockProps} />);
        
        fireEvent.click(getByTestId('ellipsis'));
        expect(getByText('Edit recipe')).toBeInTheDocument();

        fireEvent.mouseDown(document);
        expect(queryByText('Edit recipe')).not.toBeInTheDocument();
    });

    test('confirms deletion when delete is clicked', () => {
        const { getByText, getByTestId } = render(<EllipsisMenu {...mockProps} />);
        
        fireEvent.click(getByTestId('ellipsis'));
        fireEvent.click(getByText('Delete recipe'));

        //Muokkaa, kun dialogi on modaalissa!
        expect(window.confirm).toBeCalledWith("Are you certain you want to delete this recipe? Deletion cannot be undone.");
        expect(mockProps.onDelete).toBeCalled();
    });

    test('navigates to edit page when edit is clicked', () => {
        const navigateMock = jest.fn();
        router.useNavigate.mockReturnValue(navigateMock);

        const { getByTestId, getByText } = render(<EllipsisMenu {...mockProps} />);
        
        fireEvent.click(getByTestId('ellipsis'));
        fireEvent.click(getByText('Edit recipe'));

        expect(navigateMock).toBeCalledWith("/editrecipe/recipeHash123");
    });

    test('does not render menu options for non-creator user', () => {
        useUser.mockReturnValue({ username: 'anotheruser' }); // Mock a different user
        const { queryByTestId } = render(<EllipsisMenu {...mockProps} />);
        
        expect(queryByTestId('ellipsis')).not.toBeInTheDocument();
    });

    test('does not render menu options for unauthenticated user', () => {
        useUser.mockReturnValue(null); // Mock unauthenticated user
        const { queryByTestId } = render(<EllipsisMenu {...mockProps} />);
        
        expect(queryByTestId('ellipsis')).not.toBeInTheDocument();
    });
});
