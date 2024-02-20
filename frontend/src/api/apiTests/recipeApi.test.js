const { getRecipeRoutes } = require("../recipeApi");
const { getRecipeViews } = require("../recipeApi");
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

