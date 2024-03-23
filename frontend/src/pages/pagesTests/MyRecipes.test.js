import React from "react";
import { render, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import MyRecipes from "../MyRecipes"
import { getMyRecipes } from "../../api/recipeApi";

jest.mock('../../api/recipeApi'); // Mocking the API function

describe("MyRecipes component", () => {
    beforeEach(() => {
        getMyRecipes.mockReset(); // Reset mock function before each test
    });

    it("renders loading message and fetches recipes on mount", async () => {
        const mockRecipes = [{ id: 1, header: "Recipe 1" }, { id: 2, header: "Recipe 2" }];
        getMyRecipes.mockResolvedValueOnce(mockRecipes);

        const { getByText } = render(
            <BrowserRouter>
                <MyRecipes />
            </BrowserRouter>
        );

        expect(getByText("Loading...")).toBeInTheDocument();

        await waitFor(() => expect(getByText("My Recipes:")).toBeInTheDocument());
        await waitFor(() => expect(getByText("Recipe 1")).toBeInTheDocument());
    });

    it("displays error message if fetching recipes fails", async () => {
        getMyRecipes.mockRejectedValueOnce(new Error("Failed to fetch recipes"));

        const { getByText } = render(
            <BrowserRouter>
                <MyRecipes />
            </BrowserRouter>
        );

        await waitFor(() => expect(getByText("Error loading recipes")).toBeInTheDocument());
    });
});