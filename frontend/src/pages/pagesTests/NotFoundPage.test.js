import React from 'react';
import { render } from '@testing-library/react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import NotFound from '../NotFoundPage';

describe('NotFoundPage component', () => {
    
    test('Renders NotFoundPage with incorrect URL', () => {
        const { getByText } = render(
            <Router initialEntries={['/virheellinenpolku']}>
                <NotFound />
            </Router>
        );
        expect(getByText('Oops... Looks like were unable to find this recipe...')).toBeInTheDocument();
    });
});