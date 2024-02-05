const sql = require("../db/keywordSQL");

const addRecipesKeyword = async (word, recipeId) => {
    try {
        await sql.addKeyword(word);
        const keywordIdArray = await sql.getKeywordId(word);
        const id = keywordIdArray[0]["id"];
        await sql.addRecipesKeyword(id, recipeId);
    } catch (error) {
        throw error;
    }
}

const getRecipesKeywords = async (recipeId) => {
    try {
        const result = await sql.getRecipesKeywords(recipeId);
        return result;
    } catch (error) {
        throw error;
    }
}

module.exports = { addRecipesKeyword, getRecipesKeywords };