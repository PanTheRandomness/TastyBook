const { addIngredient, getIngredientId, addRecipesIngredient } = require("../ingredientSQL");
const { executeSQL } = require("../executeSQL");

jest.mock("../executeSQL");

describe("addIngredient", () => {
    it("should insert an ingredient into the database", async () => {
        const name = "Potato";

        await addIngredient(name);

        expect(executeSQL).toHaveBeenCalledWith("INSERT IGNORE INTO ingredient (name) VALUES (?)", [name]);
    });
});

describe("getKeyWordId", () => {
    it("should return id for an ingredient from the database", async () => {
        const name = "Potato";
        executeSQL.mockResolvedValueOnce([{ id: 1 }]);

        const result = await getIngredientId(name);

        expect(executeSQL).toHaveBeenCalledWith("SELECT id FROM ingredient WHERE name=?", [name]);
        expect(result).toEqual([{ id: 1 }]);
    });
});

describe("addRecipesKeyword", () => {
    it("should insert a recipes keyword into the database", async () => {
        const ingredientId = 1;
        const recipeId = 1;
        const quantity = "3 cups"

        await addRecipesIngredient(ingredientId, quantity, recipeId);

        expect(executeSQL).toHaveBeenCalledWith("INSERT INTO recipesingredient (Ingredient_id, quantity, Recipe_id) VALUES (?,?,?)", [ingredientId, quantity, recipeId]);
    });
});