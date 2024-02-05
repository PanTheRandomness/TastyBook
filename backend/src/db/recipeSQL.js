const { executeSQL } = require("./executeSQL");

const getAllRecipes = () => {
    const query = "SELECT * FROM recipe";
    return executeSQL(query, []);
}

const getAllRecipeHashes = () => {
    const query = "SELECT hash FROM recipe";
    return executeSQL(query, []);
}

const getRecipe = (hash) => {
    const query = `
    SELECT r.id, u.username, r.hash, r.header, r.description, r.visibleToAll, r.created, r.modified, r.durationHours, r.durationMinutes
    FROM recipe r LEFT JOIN user u ON r.User_id=u.id
    WHERE r.hash=?`;
    return executeSQL(query, [hash]);
}

const addRecipe = (userId, header, hash, description, visibleToAll, durationHours, durationMinutes) => {
    const query = "INSERT INTO recipe (User_id, header, hash, description, visibleToAll, durationHours, durationMinutes, created) VALUES (?,?,?,?,?,?,?,NOW())";
    return executeSQL(query, [userId, header, hash, description, visibleToAll, durationHours, durationMinutes]);
}

const addStep = (step, number, recipeId) => {
    const query = "INSERT INTO recipesteps (step, number, Recipe_id) VALUES (?,?,?)";
    return executeSQL(query, [step, number, recipeId]);
}

const getSteps = (recipeId) => {
    const query = "SELECT number, step FROM recipesteps WHERE Recipe_id=? ORDER BY number";
    return executeSQL(query, [recipeId]);
}

module.exports = { getAllRecipes, getAllRecipeHashes, getRecipe, addRecipe, addStep, getSteps };