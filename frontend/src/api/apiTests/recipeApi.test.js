const { getRecipeRoutes } = require("../recipeApi");
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
            json: jest.fn().mockResolvedValueOnce({ hashes: [{ id: 1, hash: "123"}, { id: 2, hash: "234" }]}),
        });

        const response = await getRecipeRoutes();

        expect(fetch).toHaveBeenCalledWith(`${BASE_URL}/api/recipe/urls`);
        expect(response.loggedIn).toBeUndefined();
        expect(response.hashes).toEqual( [{ id: 1, hash: "123"}, { id: 2, hash: "234" }]);
    });

    it("should fetch recipe routes with token", async () => {
        const token = "mockToken";
        fetch.mockResolvedValueOnce({
            json: jest.fn().mockResolvedValueOnce({ loggedIn: true, hashes: [{ id: 1, hash: "123"}, { id: 2, hash: "234" }]}),
        });

        const response = await getRecipeRoutes(token);

        expect(fetch).toHaveBeenCalledWith(`${BASE_URL}/api/recipe/urls`, {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });
        expect(response.loggedIn).toBe(true);
        expect(response.hashes).toEqual([{ id: 1, hash: "123"}, { id: 2, hash: "234" }]);
    });

    it("should throw an error if fetch fails", async () => {
        global.fetch.mockImplementationOnce(() => Promise.reject(new Error("Fetch failed")));

        await expect(getRecipeRoutes()).rejects.toThrow("Fetch failed");
    });
});