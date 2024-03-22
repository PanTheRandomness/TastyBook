const { getRecipeRoutes, fetchRecipeImage } = require("../recipeApi");
const { getRecipeViews } = require("../recipeApi");
const { fetchRecipe } = require("../recipeApi");
const { removeRecipe } = require("../recipeApi");
const { addReview } = require("../recipeApi");//tämä lisätty
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
    const route = "mockRoute";  

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

global.fetch = jest.fn();

describe("removeRecipe", () => {
    const BASE_URL = "http://localhost:3004";
    const route = "mockRoute";
    const token = "mockToken";

    afterEach(() => {
        jest.clearAllMocks();
    });

    it("should remove recipe with token", async () => {

        const expectedFetchOptions = {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        };

        global.fetch.mockResolvedValueOnce({
            ok: true,
            json: jest.fn().mockResolvedValueOnce({ message: "Recipe deleted successfully" }),
        });

        const response = await removeRecipe(token, route);
        expect(global.fetch).toHaveBeenCalledWith(`${BASE_URL}/api/recipe/${route}`, expectedFetchOptions);
        const responseData = await response.json();
        expect(responseData.message).toEqual("Recipe deleted successfully");
    });

    it("should throw an error if deletion fails", async () => {
        global.fetch.mockRejectedValueOnce(new Error("Deletion failed"));

        await expect(removeRecipe(token, route)).rejects.toThrow("Deletion failed");

        expect(global.fetch).toHaveBeenCalledWith(`${BASE_URL}/api/recipe/${route}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        });
    });

    it("should not call fetch if token is undefined", async () => {
         await removeRecipe(undefined, route);

        expect(global.fetch).not.toHaveBeenCalled();
    });
});

describe("fetchRecipeImage", () => {
    const route = "mockRoute";
    const token = "mockToken";
    const mockBlob = new Blob(["test image data"], { type: "image/png" });

    beforeEach(() => {
        global.fetch = jest.fn();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it("should fetch image without token", async () => {
        const mockResponse = {
            blob: jest.fn().mockResolvedValueOnce(mockBlob)
        };
        fetch.mockResolvedValueOnce(mockResponse);

        const response = await fetchRecipeImage(null, route);

        expect(fetch).toHaveBeenCalledWith(`${BASE_URL}/api/recipe/image/${route}`);
        expect(response).toEqual(mockBlob);
    });

    it("should fetch image with token", async () => {
        const mockResponse = {
            blob: jest.fn().mockResolvedValueOnce(mockBlob)
        };
        fetch.mockResolvedValueOnce(mockResponse);

        const response = await fetchRecipeImage(token, route);

        expect(fetch).toHaveBeenCalledWith(`${BASE_URL}/api/recipe/image/${route}`, {
            headers: {
                "Authorization" : "Bearer " + token
            }
        });
        expect(response).toEqual(mockBlob);
    });

    it("should throw an error if fetch fails", async () => {
        fetch.mockImplementationOnce(() => Promise.reject(new Error("Fetch failed")));

        await expect(fetchRecipeImage(null, route)).rejects.toThrow("Fetch failed");
    });
});

//arvostelun lisäämisen testit:
describe("addReview", () => {
    beforeEach(() => {
        global.fetch = jest.fn();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it("should add review with token", async () => {
        const token = "mockToken";
        const review = {
            recipeId: 1,
            rating: 5,
            comment: "Great recipe!"
        };

        const expectedFetchOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(review)
        };

        global.fetch.mockResolvedValueOnce({
            ok: true,
            json: jest.fn().mockResolvedValueOnce({ message: "Review added successfully" }),
        });

        const response = await addReview(token, review);
        expect(global.fetch).toHaveBeenCalledWith(`${BASE_URL}/api/review`, expectedFetchOptions);   
    });

    it("should throw an error if adding review fails", async () => {
        const token = "mockToken";
        const review = {
            recipeId: 1,
            rating: 5,
            comment: "Great recipe!"
        };

        global.fetch.mockRejectedValueOnce(new Error("Failed to add review"));

        await expect(addReview(token, review)).rejects.toThrow("Failed to add review");

        expect(global.fetch).toHaveBeenCalledWith(`${BASE_URL}/api/review`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(review)
        });
    });
});