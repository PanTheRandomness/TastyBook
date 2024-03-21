const { executeSQL } = require("./executeSQL");

const addFavourite = (recipeId, userId) => {
    const query = "INSERT IGNORE INTO favourite (Recipe_id, User_id) VALUES (?,?)";
    return executeSQL(query, [recipeId, userId]);
}

const deleteFavourite = (recipeId, userId) => {
    const query = "DELETE FROM favourite WHERE Recipe_id=? AND User_id=?";
    return executeSQL(query, [recipeId, userId]);
}

const getFavourites = (userId) => {
    let query = "SELECT r.id, u.username, r.hash, r.header, r.description, r.visibleToAll, r.created, r.modified, r.durationHours, r.durationMinutes, AVG(re.rating) AS average_rating FROM recipe r LEFT JOIN user u ON r.User_id=u.id LEFT JOIN review re ON re.Recipe_id=r.id";
    query += " LEFT JOIN favourite f ON f.Recipe_id=r.id WHERE f.User_id=?";
    query += " GROUP BY r.id, u.username, r.hash, r.header, r.description, r.visibleToAll, r.created, r.modified, r.durationHours, r.durationMinutes";
    return executeSQL(query, [userId]);
}

module.exports = { addFavourite, deleteFavourite, getFavourites };