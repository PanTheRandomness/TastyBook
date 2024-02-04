import { renderHook, act } from "@testing-library/react";
import { useToken } from "../useToken";

describe("useToken", () => {
    it("should initialize with the token from localStorage", () => {
        // Arrange
        localStorage.setItem("token", "initialToken");

        // Act
        const { result } = renderHook(() => useToken());

        // Assert
        expect(result.current[0]).toBe("initialToken");
    });

    it("should update token and localStorage when setToken is called", () => {
        // Arrange
        const { result } = renderHook(() => useToken());

        // Act
        act(() => {
            result.current[1]("newToken");
        });

        // Assert
        expect(result.current[0]).toBe("newToken");
        expect(localStorage.getItem("token")).toBe("newToken");
    });
});