const sql = require("../db/recipeSQL");

const getAllRecipes = async (req, res) => {
    try {
        const recipes = await sql.getAllRecipes();
        res.status(200).json(recipes);
    } catch (error) {
        res.status(500).send();
    }
}

module.exports = { getAllRecipes };