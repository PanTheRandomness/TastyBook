import React from 'react';
import { render, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';
import { getRecipeRoutes } from './api/recipeApi';
import * as token from './customHooks/useToken';
import * as user from './customHooks/useUser';

jest.mock('./api/recipeApi'); // Mocking the API function

const mockConsoleError = jest.spyOn(console, 'error').mockImplementation(() => {});

describe('Navigation component', () => {
    beforeEach(() => {
        getRecipeRoutes.mockReset(); // Reset mock function before each test
    });

    afterAll(() => {
        mockConsoleError.mockRestore();
    });

    it('renders navigation links correctly for logged-in user with token', async () => {
        const mockUser = { role: 'user' };
        const mockToken = 'mockToken123';
        const mockRoutes = ['route1', 'route2'];
        getRecipeRoutes.mockResolvedValueOnce({ hashes: mockRoutes, loggedIn: true });
        jest.spyOn(user, 'useUser').mockReturnValue(mockUser);
        jest.spyOn(token, 'useToken').mockReturnValue([mockToken, jest.fn()]);

        await waitFor(() => {
            const { getByText } = render(<App />);

            expect(getByText('Tasty Book')).toBeInTheDocument();
            expect(getByText('Add Recipe')).toBeInTheDocument();
            expect(getByText('Logout')).toBeInTheDocument();
        });
    });

    it('renders navigation links correctly for guest user without token', async () => {
        const mockUser = null;
        const mockToken = '';
        getRecipeRoutes.mockResolvedValueOnce({ hashes: [], loggedIn: false });
        jest.spyOn(user, 'useUser').mockReturnValue(mockUser);
        jest.spyOn(token, 'useToken').mockReturnValue([mockToken, jest.fn()]);

        await waitFor(() => {
            const { getByText } = render(<App />);

            expect(getByText('Tasty Book')).toBeInTheDocument();
            expect(getByText('Register')).toBeInTheDocument();
            expect(getByText('Login')).toBeInTheDocument();
        });
    });

    it('renders admin link for admin user', async () => {
        const mockUser = { role: 'admin' };
        const mockToken = 'mockToken123';
        const mockRoutes = ['route1', 'route2'];
        getRecipeRoutes.mockResolvedValueOnce({ hashes: mockRoutes, loggedIn: true });
        jest.spyOn(user, 'useUser').mockReturnValue(mockUser);
        jest.spyOn(token, 'useToken').mockReturnValue([mockToken, jest.fn()]);

        await waitFor(() => {
            const { getByText } = render(<App />);
            expect(getByText('Admin')).toBeInTheDocument();
        })
    });

    it('calls onLogout when Logout link is clicked', async () => {
        const mockUser = { role: 'user' };
        const mockToken = 'mockToken123';
        const mockRoutes = ['route1', 'route2'];
        const mockOnLogout = jest.fn();
        getRecipeRoutes.mockResolvedValueOnce({ hashes: mockRoutes, loggedIn: true });
        jest.spyOn(user, 'useUser').mockReturnValue(mockUser);
        jest.spyOn(token, 'useToken').mockReturnValue([mockToken, mockOnLogout]);

        await waitFor(() => {
            const { getByText } = render(<App />);

            userEvent.click(getByText('Logout'));
            
            expect(mockOnLogout).toHaveBeenCalledTimes(1);
        });
    });
});