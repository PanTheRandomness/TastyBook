import { jest, describe, test, expect, beforeEach, afterEach } from '@jest/globals';
import * as userApi from '../../api/userApi';  // Use the import syntax for all functions

const BASE_URL = 'http://localhost:3004';

//REGISTER-FUNKTION TESTAUS
describe('register function', () => {
    beforeEach(() => {
        global.fetch = jest.fn();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    //tähän kaikki eri testi tapaukset
    test('should register user successfully', async () => {
        // Arrange
        const username = 'testuser';
        const name = 'Test User';
        const email = 'test@example.com';
        const password = 'testpassword';
  
        fetch.mockResolvedValueOnce({
          ok: true,
          json: jest.fn().mockResolvedValueOnce({}),
        });
        
        const response = await userApi.register(username, name, email, password);  // Use userApi.register instead of register

      // Assert
      expect(response).toEqual({ ok: true });
      expect(fetch).toHaveBeenCalledWith(`${BASE_URL}/api/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, name, email, password }),
      });
    });

    test('should throw an error if registration fails', async () => {
      // Arrange
      const errorMessage = 'Registration failed';
      fetch.mockResolvedValueOnce({
        ok: false,
        statusText: errorMessage,
      });

      // Act and Assert
      await expect(userApi.register('testuser', 'Test User', 'test@example.com', 'testpassword')).rejects.toThrowError(errorMessage);
    });
});

    test('should throw an error with "Email or username is already in use." message if registration fails due to duplicate email or username', async () => {
      // Arrange
      const errorMessage = 'Conflict';
      fetch.mockResolvedValueOnce({
          ok: false,
          status: 409,
          statusText: 'Conflict',
      });

      // Act and Assert
      await expect(userApi.register('testuser', 'Test User', 'test@example.com', 'testpassword')).rejects.toThrowError(
          'Email or username is already in use.'
      );
    });

//LOGIN-FUNKTION TESTAUS

describe('login', () => {
    test('should login user successfully', async () => {
      // Arrange
      const username = 'testuser';
      const password = 'testpassword';

      fetch.mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValueOnce({ token: 'testToken' }),
      });
      
      // Act
      const response = await userApi.login(username, password);

      // Assert
      expect(response.token).toEqual('testToken');
      expect(fetch).toHaveBeenCalledWith(`${BASE_URL}/api/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });
    });

    test('should throw an error if login fails', async () => {
      // Arrange
      const errorMessage = 'Login failed';
      fetch.mockResolvedValueOnce({
        ok: false,
        statusText: errorMessage,
      });

      // Act and Assert
      await expect(userApi.login('testuser', 'testpassword')).rejects.toThrowError(
        `Login failed: ${errorMessage}`
      );
    });
  });

//ADMINREGISTER-FUNKTION TESTAUS
describe('adminregister', () => {
    test('should register admin successfully', async () => {
      // Arrange
      const username = 'adminuser';
      const name = 'Admin User';
      const email = 'admin@example.com';
      const password = 'adminpassword';
      const api_key = 'testapikey';

      fetch.mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValueOnce({}),
      });
      
      // Act
      const response = await userApi.adminregister(username, name, email, password, api_key);

      // Assert
      expect(response).toEqual({ ok: true });
      expect(fetch).toHaveBeenCalledWith(`${BASE_URL}/api/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, name, email, password, api_key }),
      });
    });

    test('should throw an error if admin registration fails', async () => {
      // Arrange
      const errorMessage = 'Registration failed';
      fetch.mockResolvedValueOnce({
        ok: false,
        statusText: errorMessage,
      });

      // Act and Assert
      await expect(userApi.adminregister('adminuser', 'Admin User', 'admin@example.com', 'adminpassword', 'testapikey')).rejects.toThrowError(errorMessage);
    });
  });

describe("verifyEmail", () => {
  beforeEach(() => {
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("should return nothing if verification is successful", async () => {
    const verificationString = "123";

    fetch.mockResolvedValueOnce({ ok: true });

    await userApi.verifyEmail(verificationString);
    expect(fetch).toHaveBeenCalledWith(`${BASE_URL}/api/verify-email`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ verificationString })
    })
  });

  test("should throw error if response is not ok", async () => {
    const verificationString = "123";
    
    fetch.mockResolvedValueOnce({ ok: false });

    await expect(userApi.verifyEmail(verificationString)).rejects.toThrowError();
  });
});

describe("forgotPassword", () => {
  test("should return nothing if sending email is successful", async () => {
    const email = "test@example.com";

    fetch.mockResolvedValueOnce({ ok: true });

    await userApi.forgotPassword(email);
    expect(fetch).toHaveBeenCalledWith(`${BASE_URL}/api/forgot-password`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email })
    })
  });

  test("should throw error if response is not ok", async () => {
    const email = "test@example.com";
    
    fetch.mockResolvedValueOnce({ ok: false });

    await expect(userApi.forgotPassword(email)).rejects.toThrowError();
  });
});