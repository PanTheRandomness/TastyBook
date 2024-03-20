const { executeSQL } = require("./executeSQL");

const getAllRecipeHashes = (loggedIn) => {
    let query = "SELECT hash FROM recipe";
    if (!loggedIn) query += " WHERE visibleToAll=1";
    return executeSQL(query, []);
}

const getRecipes = (hash, loggedIn, ingredient, keyword, username) => {
    let params = [];
    let query = "SELECT r.id, u.username, r.hash, r.header, r.description, r.visibleToAll, r.created, r.modified, r.durationHours, r.durationMinutes, AVG(re.rating) AS average_rating FROM recipe r LEFT JOIN user u ON r.User_id=u.id LEFT JOIN review re ON re.Recipe_id=r.id";
    if (ingredient) query += " LEFT JOIN recipesingredient ri ON ri.Recipe_id = r.id LEFT JOIN ingredient i ON ri.Ingredient_id = i.id";
    if (keyword) query += " LEFT JOIN recipeskeyword rk ON rk.Recipe_id = r.id LEFT JOIN keyword k ON rk.Keyword_id = k.id";
    query += " WHERE 1=1";
    if (hash) {
        query += " AND r.hash=?";
        params.push(hash);
    }
    if (!loggedIn) query += " AND r.visibleToAll=1";
    if (ingredient) {
        query += " AND i.name LIKE ?";
        params.push(`%${ingredient}%`);
    }
    if (keyword) {
        query += " AND k.word LIKE ?";
        params.push(`%${keyword}%`);
    }
    if (username) {
        query += " AND u.username LIKE ?";
        params.push(`%${username}%`);
    }
    query += " GROUP BY r.id, u.username, r.hash, r.header, r.description, r.visibleToAll, r.created, r.modified, r.durationHours, r.durationMinutes";
    return executeSQL(query, params);
}

const getImage = (hash, loggedIn) => {
    let query = "SELECT image FROM recipe WHERE hash=?";
    if (!loggedIn) query += " AND visibleToAll=1";
    return executeSQL(query, [hash]);
}

const addRecipe = (userId, header, hash, description, visibleToAll, durationHours, durationMinutes, image) => {
    const query = "INSERT INTO recipe (User_id, header, hash, description, visibleToAll, durationHours, durationMinutes, created, image) VALUES (?,?,?,?,?,?,?,NOW(),?)";
    return executeSQL(query, [userId, header, hash, description, visibleToAll, durationHours, durationMinutes, image]);
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
    let query, params;
    if (userId) {
        query = "DELETE FROM recipe WHERE hash=? AND User_id=?";
        params = [hash, userId];
    }
    else {
        query = "DELETE FROM recipe WHERE hash=?";
        params = [hash];
    }
    return executeSQL(query, params);
}

const editRecipe = (header, description, visibleToAll, durationHours, durationMinutes, image, hash, userId) => {
    let params = [header, description, visibleToAll, durationHours, durationMinutes, image, hash];
    let query = "UPDATE recipe SET header=?, description=?, visibleToAll=?, durationHours=?, durationMinutes=?, image=?, modified=NOW() WHERE hash=?";
    if (userId) {
        query +=  " AND User_id=?";
        params.push(userId);
    }
    return executeSQL(query, params);
}

const deleteSteps = (id) => {
    const query = "DELETE FROM recipesteps WHERE Recipe_id=?";
    return executeSQL(query, [id]);
}

module.exports = { getAllRecipeHashes, getRecipes, addRecipe, addStep, getSteps, deleteRecipe, editRecipe, deleteSteps, getImage };