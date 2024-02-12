const sql = require("../db/ingredientSQL");

const addRecipesIngredient = async (ingredient, recipeId) => {
    try {
        await sql.addIngredient(ingredient.name);
        const ingredientIdArray = await sql.getIngredientId(ingredient.name);
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

const deleteRecipesIngredients = async (recipeId) => {
    try {
        await sql.deleteRecipesIngredients(recipeId);
    } catch (error) {
        throw error;
    }
}

module.exports = { addRecipesIngredient, getRecipesIngredients, deleteRecipesIngredients };