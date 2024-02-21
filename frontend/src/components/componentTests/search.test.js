import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import Search from '../../Search'; 
/*
describe('Search component', () => {
    it('filters and sorts recipes correctly', () => {
        const recipes = [
            { header: '', ingredients: '' },
            { header: '', ingredients: '' },
            { header: '', ingredients: '' }
        ];

        const { getByLabelText, getByText } = render(<Search />);

        fireEvent.change(getByLabelText('Search by name or ingredients:'), { target: { value: '' } });

        fireEvent.click(getByText('Search'));

        expect(getByText('')).toBeInTheDocument();
        expect(getByText('')).toBeInTheDocument();

        expect(queryByText('No recipes available to search')).not.toBeInTheDocument();
    });

    it('displays alert if no recipes available', () => {
        const { getByText } = render(<Search />);

        fireEvent.click(getByText('Search'));

        expect(getByText('No recipes available to search')).toBeInTheDocument();
    });
});
*/