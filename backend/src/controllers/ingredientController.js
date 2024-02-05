const sql = require("../db/ingredientSQL");

const addRecipesIngredient = async (ingredient, recipeId) => {
    try {
        await sql.addIngredient(ingredient.ingredient);
        const ingredientIdArray = await sql.getIngredientId(ingredient.ingredient);
        const id = ingredientIdArray[0]["id"];
        await sql.addRecipesIngredient(id, ingredient.quantity, recipeId);
    } catch (error) {
        throw error;
    }
}

const getRecipesIngredients = async (recipeId) => {
    try {
        const result = await sql.getRecipesIngredients(recipeId);
        return result;
    } catch (error) {
        throw error;
    }
}

module.exports = { addRecipesIngredient, getRecipesIngredients };