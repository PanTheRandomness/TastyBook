const { executeSQL } = require("./executeSQL");

const addKeyword = (word) => {
    const query = "INSERT IGNORE INTO keyword (word) VALUES (?)";
    return executeSQL(query, [word]);
}

const getKeywordId = (word) => {
    const query = "SELECT id FROM keyword WHERE word=?";
    return executeSQL(query, [word]);
}

const addRecipesKeyword = (keywordId, recipeId) => {
    const query = "INSERT INTO recipeskeyword (Keyword_id, Recipe_id) VALUES (?,?)";
    return executeSQL(query, [keywordId, recipeId]);
}

module.exports = { addKeyword, getKeywordId, addRecipesKeyword };