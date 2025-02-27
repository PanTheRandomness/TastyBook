const sql = require("../../db/favouriteSQL");
const { addFavourite, deleteFavourite, getFavourites, isFavourite } = require("../favouriteController");

jest.mock("../../db/favouriteSQL");

describe("addFavourite", () => {
    let req, res;

    beforeEach(() => {
        req = {
            body: { recipeId: 1 },
            user: { id: 1 }
        };
        res = {
            status: jest.fn(() => res),
            send: jest.fn()
        };
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it("should handle inserting favourite to database", async () => {
        sql.addFavourite.mockResolvedValue({ insertId: 1 });

        await addFavourite(req, res);

        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.send).toHaveBeenCalled();
    });

    it("should handle recipe id missing", async () => {
        req.body.recipeId = null;

        await addFavourite(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.send).toHaveBeenCalled();
    });

    it("should handle not finding recipe", async () => {
        sql.addFavourite.mockResolvedValue({ insertId: 0 });

        await addFavourite(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.send).toHaveBeenCalled();
    });

    it("should handle internal server error", async () => {
        sql.addFavourite.mockRejectedValue(new Error("Database error"));

        await addFavourite(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.send).toHaveBeenCalled();
    });
});

describe("deleteFavourite", () => {
    let req, res;

    beforeEach(() => {
        req = {
            params: { recipeId: 1 },
            user: { id: 1 }
        };
        res = {
            status: jest.fn(() => res),
            send: jest.fn()
        };
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it("should handle deleting favourite from database", async () => {
        sql.deleteFavourite.mockResolvedValue({ affectedRows: 1 });

        await deleteFavourite(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.send).toHaveBeenCalled();
    });

    it("should handle not finding recipe", async () => {
        sql.deleteFavourite.mockResolvedValue({ affectedRows: 0 });

        await deleteFavourite(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.send).toHaveBeenCalled();
    });

    it("should handle internal server error", async () => {
        sql.deleteFavourite.mockRejectedValue(new Error("Database error"));

        await deleteFavourite(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.send).toHaveBeenCalled();
    });
});

describe("deleteFavourite", () => {
    let req, res;

    beforeEach(() => {
        req = {
            user: { id: 1 }
        };
        res = {
            status: jest.fn(() => res),
            send: jest.fn(),
            json: jest.fn()
        };
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it("should handle fetching favourites from database", async () => {
        sql.getFavourites.mockResolvedValue([{ id: 1 }]);

        await getFavourites(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith([{ id: 1 }]);
    });

    it("should handle not finding any favourites", async () => {
        sql.getFavourites.mockResolvedValue([]);

        await getFavourites(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.send).toHaveBeenCalled();
    });

    it("should handle internal server error", async () => {
        sql.getFavourites.mockRejectedValue(new Error("Database error"));

        await getFavourites(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.send).toHaveBeenCalled();
    });
});

describe("isFavourite", () => {
    let req, res;

    beforeEach(() => {
        req = {
            user: { id: 1 },
            params: { recipeId: 1 }
        };
        res = {
            status: jest.fn(() => res),
            send: jest.fn(),
            json: jest.fn()
        };
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it("should handle recipe marked as favourite", async () => {
        sql.isFavourite.mockResolvedValue([{ id: 1 }]);

        await isFavourite(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ favourite: true });
    });

    it("should handle recipe marked not as favourite", async () => {
        sql.isFavourite.mockResolvedValue([]);

        await isFavourite(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ favourite: false });
    });

    it("should handle internal server error", async () => {
        sql.isFavourite.mockRejectedValue(new Error("Database error"));

        await isFavourite(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.send).toHaveBeenCalled();
    });
});