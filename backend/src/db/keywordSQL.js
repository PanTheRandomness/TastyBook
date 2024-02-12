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

const getRecipesKeywords = (recipeId) => {
    const query = "SELECT k.id, k.word FROM recipeskeyword rk LEFT JOIN keyword k ON rk.Keyword_id=k.id WHERE rk.Recipe_id=?";
    return executeSQL(query, [recipeId]);
}

const deleteRecipesKeywords = (id) => {
    const query = "DELETE FROM recipeskeyword WHERE Recipe_id=?";
    return executeSQL(query, [id]);
}

module.exports = { addKeyword, getKeywordId, addRecipesKeyword, getRecipesKeywords, deleteRecipesKeywords };