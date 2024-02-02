const { executeSQL } = require("./executeSQL");

const addIngredient = (name) => {
    const query = "INSERT IGNORE INTO ingredient (name) VALUES (?)";
    return executeSQL(query, [name]);
}

const getIngredientId = (name) => {
    const query = "SELECT id FROM ingredient WHERE name=?";
    return executeSQL(query, [name]);
}

const addRecipesIngredient = (ingredientId, quantity, recipeId) => {
    const query = "INSERT INTO recipesingredient (Ingredient_id, quantity, Recipe_id) VALUES (?,?,?)";
    return executeSQL(query, [ingredientId, quantity, recipeId]);
}

module.exports = { addIngredient, getIngredientId, addRecipesIngredient };