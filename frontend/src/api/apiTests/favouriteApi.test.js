const { isFavourite, addToFavourites, deleteFavourite, getFavourites } = require("../favouriteApi");
const BASE_URL = "http://localhost:3004";

describe("addToFavourites", () => {
    beforeEach(() => {
        global.fetch = jest.fn();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it("should mark recipe as favourite", async () => {
        const token = "mockToken";
        const recipeId = 1;
        fetch.mockResolvedValueOnce({
            ok: true
        });

        await addToFavourites(recipeId, token);

        expect(fetch).toHaveBeenCalledWith(`${BASE_URL}/api/favourite`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({ recipeId })
        });
    });

    it("should throw an error if fetch fails", async () => {
        global.fetch.mockImplementationOnce(() => Promise.reject(new Error("Fetch failed")));

        await expect(addToFavourites()).rejects.toThrow("Fetch failed");
    });

    it("should throw an error if ok is false", async () => {
        const token = "mockToken";
        const recipeId = 1;
        fetch.mockResolvedValueOnce({
            ok: false
        });

        await expect(addToFavourites(recipeId, token)).rejects.toThrow("Failed to add recipe to favorites");
    });
});

describe("deleteFavourite", () => {
    beforeEach(() => {
        global.fetch = jest.fn();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it("should delete favourite", async () => {
        const token = "mockToken";
        const recipeId = 1;
        fetch.mockResolvedValueOnce({
            ok: true
        });

        await deleteFavourite(recipeId, token);

        expect(fetch).toHaveBeenCalledWith(`${BASE_URL}/api/favourite/${recipeId}`, {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });
    });

    it("should throw an error if fetch fails", async () => {
        global.fetch.mockImplementationOnce(() => Promise.reject(new Error("Fetch failed")));

        await expect(deleteFavourite()).rejects.toThrow("Fetch failed");
    });

    it("should throw an error if ok is false", async () => {
        const token = "mockToken";
        const recipeId = 1;
        fetch.mockResolvedValueOnce({
            ok: false
        });

        await expect(deleteFavourite(recipeId, token)).rejects.toThrow("Failed to delete favorite");
    });
});

describe("getFavourites", () => {
    beforeEach(() => {
        global.fetch = jest.fn();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it("should fetch favourites", async () => {
        const token = "mockToken";
        fetch.mockResolvedValueOnce({
            ok: true,
            json: jest.fn().mockResolvedValueOnce([{ id: 1 }, { id: 2 }])
        });

        const response = await getFavourites(token);

        expect(fetch).toHaveBeenCalledWith(`${BASE_URL}/api/favourite`, {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });
        expect(response).toEqual([{ id: 1 }, { id: 2 }]);
    });

    it("should throw an error if fetch fails", async () => {
        global.fetch.mockImplementationOnce(() => Promise.reject(new Error("Fetch failed")));

        await expect(getFavourites()).rejects.toThrow("Fetch failed");
    });

    it("should throw an error if ok is false", async () => {
        const token = "mockToken";
        fetch.mockResolvedValueOnce({
            ok: false
        });

        await expect(getFavourites(token)).rejects.toThrow("Failed to fetch favorites");
    });
});


describe("isFavourite", () => {
    beforeEach(() => {
        global.fetch = jest.fn();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it("should fetch to check if recipe is favourite", async () => {
        const token = "mockToken";
        const recipeId = 1;
        fetch.mockResolvedValueOnce({
            ok: true,
            json: jest.fn().mockResolvedValueOnce({ favourite: true })
        });

        const response = await isFavourite(token, recipeId);

        expect(fetch).toHaveBeenCalledWith(`${BASE_URL}/api/is-favourite/${recipeId}`, {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });
        expect(response).toEqual({ favourite: true });
    });

    it("should throw an error if fetch fails", async () => {
        global.fetch.mockImplementationOnce(() => Promise.reject(new Error("Fetch failed")));

        await expect(isFavourite()).rejects.toThrow("Fetch failed");
    });

    it("should throw an error if ok is false", async () => {
        const token = "mockToken";
        const recipeId = 1;
        fetch.mockResolvedValueOnce({
            ok: false
        });

        await expect(isFavourite(token, recipeId)).rejects.toThrow("Failed to fetch isFavourite");
    });
});