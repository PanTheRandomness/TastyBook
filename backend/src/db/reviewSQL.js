const { executeSQL } = require("./executeSQL");

const addReview = (rating, text, recipeId, userId) => {
    const query = "INSERT INTO review (rating, text, Recipe_id, User_id) VALUES (?,?,?,?)";
    return executeSQL(query, [rating, text, recipeId, userId]);
}

module.exports = { addReview };