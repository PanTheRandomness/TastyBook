const { executeSQL } = require("./executeSQL");

const getAllRecipeHashes = (loggedIn) => {
    let query = "SELECT hash FROM recipe";
    if (!loggedIn) query += " WHERE visibleToAll=1";
    return executeSQL(query, []);
}

const getRecipes = (hash, loggedIn) => {
    let params = [];
    let query = "SELECT r.id, u.username, r.hash, r.header, r.description, r.visibleToAll, r.created, r.modified, r.durationHours, r.durationMinutes, AVG(re.rating) AS average_rating FROM recipe r LEFT JOIN user u ON r.User_id=u.id LEFT JOIN review re ON re.Recipe_id=r.id WHERE 1=1";
    if (hash) {
        query += " AND r.hash=?";
        params.push(hash);
    }
    if (!loggedIn) query += " AND r.visibleToAll=1";
    return executeSQL(query, params);
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

const deleteRecipe = (hash, userId) => {
    const query = "DELETE FROM recipe WHERE hash=? AND User_id=?";
    return executeSQL(query, [hash, userId]);
}

const editRecipe = (header, description, visibleToAll, durationHours, durationMinutes, hash, userId) => {
    const query = "UPDATE recipe SET header=?, description=?, visibleToAll=?, durationHours=?, durationMinutes=?, modified=NOW() WHERE hash=? AND User_id=?";
    return executeSQL(query, [header, description, visibleToAll, durationHours, durationMinutes, hash, userId]);
}

const deleteSteps = (id) => {
    const query = "DELETE FROM recipesteps WHERE Recipe_id=?";
    return executeSQL(query, [id]);
}

module.exports = { getAllRecipeHashes, getRecipes, addRecipe, addStep, getSteps, deleteRecipe, editRecipe, deleteSteps };