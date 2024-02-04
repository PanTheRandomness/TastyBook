import { renderHook } from "@testing-library/react";
import { useUser } from "../useUser";
import { useToken } from "../useToken";

jest.mock('../useToken');

describe("useUser", () => {
    it("should return null if no token is present", () => {
        // Arrange
        useToken.mockReturnValue([null, jest.fn()]); // Mock useToken to return [null, setToken]

        // Act
        const { result } = renderHook(() => useUser());

        // Assert
        expect(result.current).toBeNull();
    });

    it("should return user data if a valid token is present", () => {
        // Arrange
        const mockToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NywidXNlcm5hbWUiOiJUZXN0IFVzZXIiLCJyb2xlIjpudWxsLCJpYXQiOjE3MDcwNjg4MDQsImV4cCI6MTcwNzA3NjAwNH0.F8MOMLznFlii_MyD9SNNQBvc-dqk0ml9Yc4KFqqu9r0";
        const mockUser = { exp: 1707076004, iat: 1707068804, id: 7, role: null, username: "Test User" };

        useToken.mockReturnValue([mockToken, jest.fn()]); // Mock useToken to return [mockToken, setToken]

        // Mock atob function to simulate decoding the token
        global.atob = jest.fn((token) => Buffer.from(token, "base64").toString("binary"));

        // Act
        const { result } = renderHook(() => useUser());

        // Assert
        expect(result.current).toEqual(mockUser);
    });

    it("should return null if the token is invalid", () => {
        // Arrange
        const invalidToken = "invalidToken";

        useToken.mockReturnValue([invalidToken, jest.fn()]); // Mock useToken to return [invalidToken, setToken]

        // Mock atob function to simulate decoding an invalid token
        global.atob = jest.fn(() => {
            throw new Error("Invalid token");
        });

        // Act
        const { result } = renderHook(() => useUser());

        // Assert
        expect(result.current).toBeNull();
    });
});