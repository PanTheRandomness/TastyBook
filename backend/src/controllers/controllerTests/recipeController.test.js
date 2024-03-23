const { addRecipe, getAllRecipeHashes, getRecipe, deleteRecipe, editRecipe, getAllRecipes, deleteRecipeAdmin, getImage, getMyRecipes } = require("../recipeController");
const sql = require("../../db/recipeSQL");
const { addRecipesKeyword, getRecipesKeywords, deleteRecipesKeywords } = require("../keywordController");
const { addRecipesIngredient, getRecipesIngredients, deleteRecipesIngredients } = require("../ingredientController");
const crypto = require("crypto");
const { getReviews } = require("../../db/reviewSQL");

jest.mock("../../db/recipeSQL");
jest.mock("../keywordController");
jest.mock("../ingredientController");
jest.mock("crypto");
jest.mock("../../db/reviewSQL")

describe("getAllRecipes", () => {
    let req, res;

    beforeEach(() => {
        req = { query: {}};
        res = {
            status: jest.fn(() => res),
            json: jest.fn(),
            send: jest.fn(),
        };
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it("should handle fetching recipes from the database", async () => {
        sql.getRecipes.mockResolvedValue([{ id: 123 }, { id: 234 }]);
        await getAllRecipes(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ recipes: [{ id: 123 }, { id: 234 }]});
    });

    it("should handle fetching recipes from the database and sending loggedIn", async () => {
        sql.getRecipes.mockResolvedValue([{ id: 123 }, { id: 234 }]);
        req.loggedIn = true;
        await getAllRecipes(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ loggedIn: true, recipes: [{ id: 123 }, { id: 234 }]});
    });

    it("should handle internal server error", async () => {
        sql.getRecipes.mockRejectedValue(new Error("Database error"));

        await getAllRecipes(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.send).toHaveBeenCalled();
        expect(res.json).not.toHaveBeenCalled();
    });
});

describe("getAllRecipeHashes", () => {
    let req, res;

    beforeEach(() => {
        req = {};
        res = {
            status: jest.fn(() => res),
            json: jest.fn(),
            send: jest.fn(),
        };
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it("should handle fetching hashes from the database", async () => {
        sql.getAllRecipeHashes.mockResolvedValue([{ hash: "123"}, { hash: "234" }]);
        await getAllRecipeHashes(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ hashes: [{ hash: "123"}, { hash: "234" }]});
    });

    it("should handle fetching hashes from the database and sending loggedIn", async () => {
        sql.getAllRecipeHashes.mockResolvedValue([{ hash: "123"}, { hash: "234" }]);
        req.loggedIn = true;
        await getAllRecipeHashes(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ loggedIn: true, hashes: [{ hash: "123"}, { hash: "234" }]});
    });

    it("should handle internal server error", async () => {
        sql.getAllRecipeHashes.mockRejectedValue(new Error("Database error"));

        await getAllRecipeHashes(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.send).toHaveBeenCalled();
        expect(res.json).not.toHaveBeenCalled();
    });
});

describe("getRecipe", () => {
    let req, res;

    beforeEach(() => {
        req = {
            params: { hash: "123" }
        }
        res = {
            status: jest.fn(() => res),
            json: jest.fn(),
            send: jest.fn(),
        };
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it("should return 404 if there is no recipe for the hash or there is but it's not marked visibleToAll and user is not logged in", async () => {
        sql.getRecipes.mockResolvedValue([]);

        await getRecipe(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.send).toHaveBeenCalled();
        expect(res.json).not.toHaveBeenCalled();
    });

    it("should handle fetching recipe from the database", async () => {
        // sql.getRecipe(hash) palauttaa todellisuudessa kaikki reseptin tiedot
        sql.getRecipes.mockResolvedValue([{ id: 1, visibleToAll: 1 }]);
        sql.getSteps.mockResolvedValue([{ number: 1, step: "eka" }, { number: 2, step: "toka" }]);
        getRecipesIngredients.mockResolvedValue([{ id: 1, name: "potato", quantity: "5kg"}, { id: 2, name: "tomato", quantity: "2"}]);
        getRecipesKeywords.mockResolvedValue([{ id: 1, word: "Soup" }, { id: 2, word: "Meat" }]);
        getReviews.mockResolvedValue([{ id: 1 }, { id: 2 }]);

        await getRecipe(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(
            {
                id: 1,
                visibleToAll: 1,
                steps: [{ number: 1, step: "eka" }, { number: 2, step: "toka" }],
                ingredients: [{ id: 1, name: "potato", quantity: "5kg"}, { id: 2, name: "tomato", quantity: "2"}],
                keywords: [{ id: 1, word: "Soup" }, { id: 2, word: "Meat" }],
                reviews: [{ id: 1 }, { id: 2 }]
            }
        );
    });

    it("should handle fetching recipe from the database if recipe is not marked visible to all but user is logged in", async () => {
        // sql.getRecipe(hash) palauttaa todellisuudessa kaikki reseptin tiedot
        req.loggedIn = true;
        sql.getRecipes.mockResolvedValue([{ id: 1, visibleToAll: 0 }]);
        sql.getSteps.mockResolvedValue([{ number: 1, step: "eka" }, { number: 2, step: "toka" }]);
        getRecipesIngredients.mockResolvedValue([{ id: 1, name: "potato", quantity: "5kg"}, { id: 2, name: "tomato", quantity: "2"}]);
        getRecipesKeywords.mockResolvedValue([{ id: 1, word: "Soup" }, { id: 2, word: "Meat" }]);
        getReviews.mockResolvedValue([{ id: 1 }, { id: 2 }]);

        await getRecipe(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(
            {
                id: 1,
                visibleToAll: 0,
                steps: [{ number: 1, step: "eka" }, { number: 2, step: "toka" }],
                ingredients: [{ id: 1, name: "potato", quantity: "5kg"}, { id: 2, name: "tomato", quantity: "2"}],
                keywords: [{ id: 1, word: "Soup" }, { id: 2, word: "Meat" }],
                reviews: [{ id: 1 }, { id: 2 }]
            }
        );
    });

    it("should handle internal server error", async () => {
        sql.getRecipes.mockRejectedValue(new Error("Database error"));

        await getRecipe(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.send).toHaveBeenCalled();
    });
});

describe("getImage", () => {
    let req, res;

    beforeEach(() => {
        req = {
            params: { hash: "123" }
        }
        res = {
            status: jest.fn(() => res),
            json: jest.fn(),
            send: jest.fn(),
            end: jest.fn(),
            setHeader: jest.fn()
        };
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it("should return 404 if no image was found", async () => {
        sql.getImage.mockResolvedValue([]);

        await getImage(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.send).toHaveBeenCalled();
    });

    it("should return png if png image was found", async () => {
        sql.getImage.mockResolvedValue([{ image: [ 0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A ]}]);

        await getImage(req, res);

        expect(sql.getImage).toHaveBeenCalledWith(req.params.hash, req.loggedIn);
        expect(res.setHeader).toHaveBeenCalledWith("Content-Type", "image/png");
        expect(res.end).toHaveBeenCalled();
    });

    it("should return jpeg if jpeg image was found (with loggedIn)", async () => {
        req.loggedIn = true;
        sql.getImage.mockResolvedValue([{ image: [ 0xFF, 0xD8, 0xFF ]}]);

        await getImage(req, res);

        expect(sql.getImage).toHaveBeenCalledWith(req.params.hash, req.loggedIn);
        expect(res.setHeader).toHaveBeenCalledWith("Content-Type", "image/jpeg");
        expect(res.end).toHaveBeenCalled();
    });

    it("should return 404 if not png or jpeg", async () => {
        sql.getImage.mockResolvedValue([{ image: [ 0x47, 0x0D ]}]);

        await getImage(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.send).toHaveBeenCalled();
    });

    it("should handle internal server error", async () => {
        sql.getImage.mockRejectedValue(new Error("Database error"));

        await getImage(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.send).toHaveBeenCalled();
    });
});

describe("addRecipe", () => {
    let req, res;

    beforeEach(() => {
        req = {
            body: {
                header: "makaronilaatikko",
                description: "hyvää",
                visibleToAll: "1",
                durationHours: "1",
                durationMinutes: "30",
                steps: '["eka", "toka"]',
                keywords: '["avain", "sana"]',
                ingredients: '[{ "quantity": "100 g", "name": "potato" }, { "quantity": "5 kg", "name": "tomato" }]'
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

    it ("should handle too long items with 400 status code", async () => {
        req.body.header = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec ultrices lacinia varius. Morbi at congue risus, nec facilisis nibh. Curabitur arcu nulla, tincidunt nec dictum eget, iaculis nec felis.";
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
        expect(addRecipesIngredient).toHaveBeenCalledWith({ quantity: "5 kg", name: "tomato" }, resultSQL.insertedId);

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

describe("deleteRecipe", () => {
    let req, res;

    beforeEach(() => {
        req = {
            params: { hash: "123" },
            user: { id: 1 }
        }
        res = {
            status: jest.fn(() => res),
            json: jest.fn(),
            send: jest.fn(),
        };
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it("should handle deleting recipe and sending statuscode 200", async () => {
        sql.deleteRecipe.mockReturnValue({ affectedRows: 1 });
        await deleteRecipe(req, res);

        expect(sql.deleteRecipe).toHaveBeenCalledWith(req.params.hash, req.user.id);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.send).toHaveBeenCalled();
    });

    it("should handle deleting any recipe if admin", async () => {
        req.user.role = "admin";
        sql.deleteRecipe.mockReturnValue({ affectedRows: 1 });
        await deleteRecipe(req, res);

        expect(sql.deleteRecipe).toHaveBeenCalledWith(req.params.hash, null);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.send).toHaveBeenCalled();
    });

    it("should return 404 if no recipe was found", async () => {
        sql.deleteRecipe.mockReturnValue({ affectedRows: 0 });
        await deleteRecipe(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.send).toHaveBeenCalled();
    });

    it("should handle internal server error", async () => {
        sql.deleteRecipe.mockRejectedValue(new Error("Database error"));

        await deleteRecipe(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.send).toHaveBeenCalled();
    });
});

describe("editRecipe", () => {
    let req, res;

    beforeEach(() => {
        req = {
            body: {
                id: "1",
                header: "makaronilaatikko",
                description: "hyvää",
                visibleToAll: "1",
                durationHours: "1",
                durationMinutes: "30",
                steps: '["eka", "toka"]',
                keywords: '["avain", "sana"]',
                ingredients: '[{ "quantity": "100 g", "name": "potato" }, { "quantity": "5 kg", "name": "tomato" }]'
            },
            user: { id: 123 },
            params: {
                hash: "123"
            }
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

        await editRecipe(req, res);
    
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.send).toHaveBeenCalled();
    });

    it("should handle editing recipe in the database", async () => {
        sql.editRecipe.mockReturnValue({ changedRows: 1 });

        await editRecipe(req, res);

        expect(sql.editRecipe).toHaveBeenCalledWith(req.body.header, req.body.description, 1, 1, 30, null, req.params.hash, req.user.id);
        expect(deleteRecipesKeywords).toHaveBeenCalledWith(req.body.id);
        expect(addRecipesKeyword).toHaveBeenCalledWith("avain", req.body.id);
        expect(sql.deleteSteps).toHaveBeenCalledWith(req.body.id);
        expect(sql.addStep).toHaveBeenCalledWith("toka", 2, req.body.id);
        expect(deleteRecipesIngredients).toHaveBeenCalledWith(req.body.id);
        expect(addRecipesIngredient).toHaveBeenCalledWith({ quantity: "5 kg", name: "tomato" }, req.body.id);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.send).toHaveBeenCalled();
    });

    it("should handle editing any recipe if admin", async () => {
        req.user.role = "admin";
        sql.editRecipe.mockReturnValue({ changedRows: 1 });

        await editRecipe(req, res);

        expect(sql.editRecipe).toHaveBeenCalledWith(req.body.header, req.body.description, 1, 1, 30, null, req.params.hash, null);
        expect(deleteRecipesKeywords).toHaveBeenCalledWith(req.body.id);
        expect(addRecipesKeyword).toHaveBeenCalledWith("avain", req.body.id);
        expect(sql.deleteSteps).toHaveBeenCalledWith(req.body.id);
        expect(sql.addStep).toHaveBeenCalledWith("toka", 2, req.body.id);
        expect(deleteRecipesIngredients).toHaveBeenCalledWith(req.body.id);
        expect(addRecipesIngredient).toHaveBeenCalledWith({ quantity: "5 kg", name: "tomato" }, req.body.id);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.send).toHaveBeenCalled();
    });

    it("should return 404 if no recipe was edited", async () => {
        sql.editRecipe.mockReturnValue({ changedRows: 0 });

        await editRecipe(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.send).toHaveBeenCalled();
    });

    it("should handle internal server error", async () => {
        sql.editRecipe.mockRejectedValue(new Error("Database error"));

        await editRecipe(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.send).toHaveBeenCalled();
    });
});

describe("getMyRecipes", () => {
    let req, res;

    beforeEach(() => {
        req = {
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

    it("should fetch recipes from database", async () => {
        sql.getMyRecipes.mockReturnValue([{ id: 1 }]);

        await getMyRecipes(req, res);

        expect(res.status).toHaveBeenCalledWith(200)
        expect(res.json).toHaveBeenCalledWith([{ id: 1 }]);
    });

    it("should handle internal server error", async () => {
        sql.getMyRecipes.mockRejectedValue(new Error("Database error"));

        await getMyRecipes(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.send).toHaveBeenCalled();
    });
});