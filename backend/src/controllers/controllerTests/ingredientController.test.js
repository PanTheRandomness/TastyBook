const sql = require("../../db/ingredientSQL");
const { addRecipesIngredient } = require("../ingredientController");

jest.mock("../../db/ingredientSQL");

describe("addRecipesIngredient", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it("should handle inserting ingredients and recipe's ingredients to the database", async () => {
        const ingredient = { name: "Potato", quantity: "2 cups" };
        const recipeId = 1;

        sql.addIngredient.mockResolvedValueOnce();
        sql.getIngredientId.mockResolvedValueOnce([{ id: 123 }]);
        sql.addRecipesIngredient.mockResolvedValueOnce();

        await addRecipesIngredient(ingredient, recipeId);

        expect(sql.addIngredient).toHaveBeenCalledWith("Potato");
        expect(sql.getIngredientId).toHaveBeenCalledWith("Potato");
        expect(sql.addRecipesIngredient).toHaveBeenCalledWith(123, "2 cups", 1);
    });

    it("throws an error if any SQL query fails", async () => {
        const ingredient = { name: "Potato", quantity: "2 cups" };
        const recipeId = 1;
    
        sql.addIngredient.mockRejectedValueOnce(new Error("Failed to add ingredient"));

        await expect(addRecipesIngredient(ingredient, recipeId)).rejects.toThrow("Failed to add ingredient");
    
        // Verify that the other SQL functions were not called
        expect(sql.getIngredientId).not.toHaveBeenCalled();
        expect(sql.addRecipesIngredient).not.toHaveBeenCalled();
      });
});