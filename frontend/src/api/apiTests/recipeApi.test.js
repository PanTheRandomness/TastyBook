const { getRecipeRoutes } = require("../recipeApi");
const { getRecipeViews } = require("../recipeApi");
const { fetchRecipe } = require("../recipeApi");
const BASE_URL = "http://localhost:3004";

describe("getRecipeRoutes", () => {
    beforeEach(() => {
        global.fetch = jest.fn();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it("should fetch recipe routes without token", async () => {
        fetch.mockResolvedValueOnce({
            json: jest.fn().mockResolvedValueOnce({ hashes: [{ hash: "123"}, { hash: "234" }]}),
        });

        const response = await getRecipeRoutes();

        expect(fetch).toHaveBeenCalledWith(`${BASE_URL}/api/recipe/urls`);
        expect(response.loggedIn).toBeUndefined();
        expect(response.hashes).toEqual( [{ hash: "123"}, { hash: "234" }]);
    });

    it("should fetch recipe routes with token", async () => {
        const token = "mockToken";
        fetch.mockResolvedValueOnce({
            json: jest.fn().mockResolvedValueOnce({ loggedIn: true, hashes: [{ hash: "123"}, { hash: "234" }]}),
        });

        const response = await getRecipeRoutes(token);

        expect(fetch).toHaveBeenCalledWith(`${BASE_URL}/api/recipe/urls`, {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });
        expect(response.loggedIn).toBe(true);
        expect(response.hashes).toEqual([{ hash: "123"}, { hash: "234" }]);
    });

    it("should throw an error if fetch fails", async () => {
        global.fetch.mockImplementationOnce(() => Promise.reject(new Error("Fetch failed")));

        await expect(getRecipeRoutes()).rejects.toThrow("Fetch failed");
    });
});

//RecipeViews testit:

describe("getRecipeViews", () => {
    beforeEach(() => {
        global.fetch = jest.fn();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it("should fetch recipeviews without token", async () => {
        fetch.mockResolvedValueOnce({
            json: jest.fn().mockResolvedValueOnce({ recipes: [{ id: 1, header: "123"}, { id: 2, header: "234" }]}),
        });

        const response = await getRecipeViews();

        expect(fetch).toHaveBeenCalledWith(`${BASE_URL}/api/recipes`);
        expect(response.loggedIn).toBeUndefined();
        expect(response.recipes).toEqual( [{ id: 1, header: "123"}, { id: 2, header: "234" }]);
    });

    it("should fetch recipeviews with token", async () => {
        const token = "mockToken";
        fetch.mockResolvedValueOnce({
            json: jest.fn().mockResolvedValueOnce({ loggedIn: true, recipes: [{ id: 1, header: "123"}, { id: 2, header: "234" }]}),
        });

        const response = await getRecipeViews(token);

        expect(fetch).toHaveBeenCalledWith(`${BASE_URL}/api/recipes`, {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });
        expect(response.loggedIn).toBe(true);
        expect(response.recipes).toEqual([{ id: 1, header: "123"}, { id: 2, header: "234" }]);
    });

    it("should throw an error if fetch fails", async () => {
        global.fetch.mockImplementationOnce(() => Promise.reject(new Error("Fetch failed")));

        await expect(getRecipeViews()).rejects.toThrow("Fetch failed");
    });
});

//fetchRecipe-testit

describe("fetchRecipe", () => {
    const BASE_URL = "http://localhost:3004";
    const route = "mockRoute";  // Määrittele route tässä

    beforeEach(() => {
        global.fetch = jest.fn();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it("should fetch recipe without token", async () => {
        const mockRecipe = { id: 1, header: "Test Recipe" };
    
        fetch.mockResolvedValueOnce({
            ok: true,
            json: jest.fn().mockResolvedValueOnce({ recipe: mockRecipe }),
        });
    
        const response = await fetchRecipe(undefined, route);
    
        expect(fetch).toHaveBeenCalledWith(`${BASE_URL}/api/recipe/${route}`);
        expect(response.recipe).toEqual(mockRecipe);
    });

    it("should fetch recipe with token", async () => {
        const token = "mockToken";
        const mockRecipe = { id: 1, header: "Test Recipe" };
    
        fetch.mockResolvedValueOnce({
            ok: true,
            json: jest.fn().mockResolvedValueOnce({ recipe: mockRecipe }),
        });
    
        const response = await fetchRecipe(token, route);
    
        expect(fetch).toHaveBeenCalledWith(`${BASE_URL}/api/recipe/${route}`, {
            headers: {
                "Authorization": `Bearer ${token}`,
            },
        });
        expect(response.recipe).toEqual(mockRecipe);
    });

    it("should throw an error if fetch fails", async () => {
        global.fetch.mockImplementationOnce(() => Promise.reject(new Error("Fetch failed")));

        await expect(fetchRecipe(undefined, route)).rejects.toThrow("Fetch failed");
    });
});

//removeRecipe-testit
