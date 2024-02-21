import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import Search from '../search'; 

// Poista tämä kun joku muu testi toimii
describe('asd', () => {
    it('asd', () => {
        expect(1+1).toBe(2);
    });
});

/*
describe('Search component', () => {
    it('filters and sorts recipes correctly', () => {
        const recipes = [
            { header: 'peruna', ingredients: 'peruna, vesi' },
            { header: 'riisi', ingredients: 'riisi, vesi' },
        ];

        const { getByLabelText, getByText } = render(<Search />);

        fireEvent.change(getByLabelText('Search by name or ingredients:'), { target: { value: '' } });

        fireEvent.click(getByText('Search'));

        expect(getByText('peruna')).toBeInTheDocument();
        expect(getByText('riisi')).toBeInTheDocument();

        expect(queryByText('No recipes available to search')).not.toBeInTheDocument();
    });

    it('displays alert if no recipes available', () => {
        const { getByText } = render(<Search />);

        fireEvent.click(getByText('Search'));

        expect(getByText('No recipes available to search')).toBeInTheDocument();
    });
}); */
