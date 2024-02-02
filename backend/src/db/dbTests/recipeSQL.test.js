const { addRecipe, addStep } = require("../recipeSQL");
const { executeSQL } = require("../executeSQL");

jest.mock("../executeSQL");

describe("addRecipe", () => {
    it("should insert a recipe into the database", async () => {
        const userId = 1;
        const header = "Header";
        const hash = "123456";
        const description = "Tasty food";
        const visibleToAll = 1;
        const durationHours = 1;
        const durationMinutes = 0;

        const result = await addRecipe(userId, header, hash, description, visibleToAll, durationHours, durationMinutes);

        expect(executeSQL).toHaveBeenCalledWith(
            "INSERT INTO recipe (User_id, header, hash, description, visibleToAll, durationHours, durationMinutes, created) VALUES (?,?,?,?,?,?,?,NOW())",
            [userId, header, hash, description, visibleToAll, durationHours, durationMinutes]
        );
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