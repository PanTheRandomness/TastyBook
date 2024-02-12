const { addIngredient, getIngredientId, addRecipesIngredient, getRecipesIngredients, deleteRecipesIngredients } = require("../ingredientSQL");
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

describe("getRecipesIngredients", () => {
    it("should return all recipes ingredients", async () => {
        const recipeId = 1;
        executeSQL.mockResolvedValueOnce([{ id: 1, name: "potato", quantity: "5kg"}, { id: 2, name: "tomato", quantity: "2"}]);

        const result = await getRecipesIngredients(recipeId);

        expect(executeSQL).toHaveBeenCalledWith("SELECT i.id, i.name, ri.quantity FROM recipesingredient ri LEFT JOIN ingredient i ON ri.Ingredient_id=i.id WHERE ri.Recipe_id=?", [recipeId]);
        expect(result).toEqual([{ id: 1, name: "potato", quantity: "5kg"}, { id: 2, name: "tomato", quantity: "2"}]);
    });
});

describe("deleteRecipesIngredients", () => {
    it("should delete recipes ingredients from the database", async () => {
        const recipeId = 1;

        await deleteRecipesIngredients(recipeId);

        expect(executeSQL).toHaveBeenCalledWith("DELETE FROM recipesingredient WHERE Recipe_id=?", [recipeId]);
    });
});