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

const getRecipesIngredients = (recipeId) => {
    const query = "SELECT i.id, i.name, ri.quantity FROM recipesingredient ri LEFT JOIN ingredient i ON ri.Ingredient_id=i.id WHERE ri.Recipe_id=?";
    return executeSQL(query, [recipeId]);
}

const deleteRecipesIngredients = (id) => {
    const query = "DELETE FROM recipesingredient WHERE Recipe_id=?";
    return executeSQL(query, [id]);
}

module.exports = { addIngredient, getIngredientId, addRecipesIngredient, getRecipesIngredients, deleteRecipesIngredients };