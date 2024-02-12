import * as router from 'react-router';
import { render, fireEvent, waitFor } from '@testing-library/react';
import { Login } from '../LoginPage';
import { login } from '../../api/userApi';

// Mock the login function
jest.mock('../../api/userApi', () => ({
    login: jest.fn(),
}));



describe('Login component', () => {
    const navigate = jest.fn()

    beforeEach(() => {
        jest.spyOn(router, 'useNavigate').mockImplementation(() => navigate)
    })

    test('should call onLogin with token when login succeeds', async () => {
        // Arrange
        const token = 'mockedToken';
        const onLoginMock = jest.fn();
        const username = 'testuser';
        const password = 'testpassword';
        login.mockResolvedValueOnce({ token });

        // Act
        const { getByPlaceholderText, getByTestId } = render(
            <Login onLogin={onLoginMock} />
        );
        fireEvent.change(getByPlaceholderText('username'), {
            target: { value: username },
        });
        fireEvent.change(getByPlaceholderText('password'), {
            target: { value: password },
        });
        fireEvent.click(getByTestId("login-button"));

        // Assert
        await waitFor(() => expect(onLoginMock).toHaveBeenCalledWith(token));
        expect(navigate).toHaveBeenCalledWith('/');
    });

    test('should log error when login fails', async () => {
        // Arrange
        const onLoginMock = jest.fn();
        const username = 'testuser';
        const password = 'testpassword';
        const errorMessage = 'Invalid credentials';
        login.mockRejectedValueOnce(new Error(errorMessage));

        // Act
        const { getByPlaceholderText, getByTestId } = render(
            <Login onLogin={onLoginMock} />
        );
        fireEvent.change(getByPlaceholderText('username'), {
            target: { value: username },
        });
        fireEvent.change(getByPlaceholderText('password'), {
            target: { value: password },
        });
        fireEvent.click(getByTestId("login-button"))

        // Assert
        await waitFor(() => expect(onLoginMock).not.toHaveBeenCalled());
    });
});