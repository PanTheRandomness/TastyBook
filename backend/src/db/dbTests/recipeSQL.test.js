const { addRecipe, addStep, getAllRecipeHashes, getSteps } = require("../recipeSQL");
const { executeSQL } = require("../executeSQL");

jest.mock("../executeSQL");

describe("getAllRecipeHashes", () => {
    it("should return all hashes from recipe table", async () => {
        executeSQL.mockReturnValueOnce([{ hash: "123"}, { hash: "234" }]);
        const result = await getAllRecipeHashes();

        expect(executeSQL).toHaveBeenCalledWith("SELECT hash FROM recipe", []);
        expect(result).toEqual([{ hash: "123"}, { hash: "234" }]);
    });
});

describe("addRecipe", () => {
    it("should insert a recipe into the database", async () => {
        const userId = 1;
        const header = "Header";
        const hash = "123456";
        const description = "Tasty food";
        const visibleToAll = 1;
        const durationHours = 1;
        const durationMinutes = 0;

        executeSQL.mockReturnValueOnce({ insertedId: 1 });

        const result = await addRecipe(userId, header, hash, description, visibleToAll, durationHours, durationMinutes);

        expect(executeSQL).toHaveBeenCalledWith(
            "INSERT INTO recipe (User_id, header, hash, description, visibleToAll, durationHours, durationMinutes, created) VALUES (?,?,?,?,?,?,?,NOW())",
            [userId, header, hash, description, visibleToAll, durationHours, durationMinutes]
        );
        expect(result).toEqual({ insertedId: 1 });
    });
});

describe("addStep", () => {
    it("should insert a step into the database", async () => {
        const step = "Do this";
        const number = 2;
        const recipeId = 3;

        await addStep(step, number, recipeId);

        expect(executeSQL).toHaveBeenCalledWith("INSERT INTO recipesteps (step, number, Recipe_id) VALUES (?,?,?)", [step, number, recipeId]);
    });
});

describe("getSteps", () => {
    it("should return all recipes steps", async () => {
        const recipeId = 1;
        executeSQL.mockReturnValueOnce([{ number: 1, step: "eka" }, { number: 2, step: "toka" }]);

        const result = await getSteps(recipeId);

        expect(executeSQL).toHaveBeenCalledWith("SELECT number, step FROM recipesteps WHERE Recipe_id=? ORDER BY number", [recipeId]);
        expect(result).toEqual([{ number: 1, step: "eka" }, { number: 2, step: "toka" }]);
    });
});