const { executeSQL } = require("./executeSQL");

const getAllRecipes = () => {
    const query = "SELECT * FROM recipe";
    return executeSQL(query, []);
}

const addRecipe = (userId, header, hash, description, visibleToAll, durationHours, durationMinutes) => {
    const query = "INSERT INTO recipe (User_id, header, hash, description, visibleToAll, durationHours, durationMinutes, created) VALUES (?,?,?,?,?,?,?,NOW())";
    return executeSQL(query, [userId, header, hash, description, visibleToAll, durationHours, durationMinutes]);
}

const addStep = (step, number, recipeId) => {
    const query = "INSERT INTO recipesteps (step, number, Recipe_id) VALUES (?,?,?)";
    return executeSQL(query, [step, number, recipeId]);
}

module.exports = { getAllRecipes, addRecipe, addStep };