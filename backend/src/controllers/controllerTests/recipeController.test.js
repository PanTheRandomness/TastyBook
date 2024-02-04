const { addRecipe } = require("../recipeController");
const sql = require("../../db/recipeSQL");
const { addRecipesKeyword } = require("../keywordController");
const { addRecipesIngredient } = require("../ingredientController");
const crypto = require("crypto");

jest.mock("../../db/recipeSQL");
jest.mock("../keywordController");
jest.mock("../ingredientController");
jest.mock("crypto");

describe("addRecipe", () => {
    let req, res;

    beforeEach(() => {
        req = {
            body: {
                header: "makaronilaatikko",
                description: "hyvää",
                visibleToAll: 1,
                durationHours: 1,
                durationMinutes: 30,
                steps: ["eka", "toka"],
                keywords: ["avain", "sana"],
                ingredients: [{ quantity: "100 g", ingredient: "potato" }, { quantity: "5 kg", ingredient: "tomato" }]
            },
            user: { id: 123 }
        };
        res = {
            status: jest.fn(() => res),
            json: jest.fn(),
            send: jest.fn(),
        };
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it("should handle invalid request body with 400 status code", async () => {
        req.body.header = null;

        await addRecipe(req, res);
    
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.send).toHaveBeenCalled();
    });

    it("should handle inserting recipes into the database", async () => {
        const mockDigest = jest.fn(() => "hashedRecipe");
        const createHashSpy = jest.spyOn(crypto, "createHash").mockReturnValue({
            update: jest.fn().mockReturnValue({ digest: mockDigest }),
        });
        const resultSQL = sql.addRecipe.mockResolvedValue({ insertedId: 11 });

        await addRecipe(req, res);

        expect(createHashSpy).toHaveBeenCalledWith("sha256");
        expect(mockDigest).toHaveBeenCalledWith("hex");

        expect(addRecipesKeyword).toHaveBeenCalledWith("avain", resultSQL.insertedId);
        expect(sql.addStep).toHaveBeenCalledWith("toka", 2, resultSQL.insertedId);
        expect(addRecipesIngredient).toHaveBeenCalledWith({ quantity: "5 kg", ingredient: "tomato" }, resultSQL.insertedId);

        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalled();
    });

    it("should handle internal server error", async () => {
        sql.addRecipe.mockRejectedValue(new Error("Database error"));

        await addRecipe(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.send).toHaveBeenCalled();
    });
});