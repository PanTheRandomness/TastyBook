const { executeSQL } = require("./executeSQL");

const addReview = (rating, text, recipeId, userId) => {
    const query = "INSERT INTO review (rating, text, Recipe_id, User_id) VALUES (?,?,?,?)";
    return executeSQL(query, [rating, text, recipeId, userId]);
}

const getReviews = (recipeId) => {
    const query = "SELECT r.id, r.rating, r.text, u.username FROM review r LEFT JOIN user u ON r.User_id=u.id WHERE r.Recipe_id=?";
    return executeSQL(query, [recipeId]);
}

module.exports = { addReview, getReviews };