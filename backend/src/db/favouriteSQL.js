const { executeSQL } = require("./executeSQL");

const addFavourite = (recipeId, userId) => {
    const query = "INSERT IGNORE INTO favourite (Recipe_id, User_id) VALUES (?,?)";
    return executeSQL(query, [recipeId, userId]);
}

const deleteFavourite = (recipeId, userId) => {
    const query = "DELETE FROM favourite WHERE Recipe_id=? AND User_id=?";
    return executeSQL(query, [recipeId, userId]);
}

module.exports = { addFavourite, deleteFavourite };