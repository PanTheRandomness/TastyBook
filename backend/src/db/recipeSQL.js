const { executeSQL } = require("./executeSQL");

const getAllRecipes = () => {
    const query = "SELECT * FROM recipe";
    return executeSQL(query, []);
}

module.exports = { getAllRecipes };