const { executeSQL } = require("./executeSQL");

const addFavourite = (recipeId, userId) => {
    const query = "INSERT IGNORE INTO favourite (Recipe_id, User_id) VALUES (?,?)";
    return executeSQL(query, [recipeId, userId]);
}

module.exports = { addFavourite };