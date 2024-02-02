const sql = require("../db/recipeSQL");
const { addRecipesKeyword } = require("./keywordController");
const { addRecipesIngredient } = require("./ingredientController");
const crypto = require("crypto");

const getAllRecipes = async (req, res) => {
    try {
        const recipes = await sql.getAllRecipes();
        res.status(200).json(recipes);
    } catch (error) {
        res.status(500).send();
    }
}

const addRecipe = async (req, res) => {
    try {
        const { header, description, visibleToAll, durationHours, durationMinutes, steps, keywords, ingredients } = req.body;
        if (!header || !description) return res.status(400).send();
        const userId = req.user.id;

        const time = Date.now();
        const hash = calculateSHA256(`${header}:${time}`);

        const result = await sql.addRecipe(userId, header, hash, description, visibleToAll, durationHours, durationMinutes);

        keywords.map(async (word) => (
            await addRecipesKeyword(word, result.insertId)
        ));

        steps.map(async (step, index) => (
            await sql.addStep(step, index + 1, result.insertId)
        ));

        ingredients.map(async (ingredient) => (
            await addRecipesIngredient(ingredient, result.insertId)
        ));

        res.status(201).json(hash);
    } catch (error) {
        res.status(500).send();
    }
}

const calculateSHA256 = (data) => {
    const hash = crypto.createHash("sha256");
    hash.update(data);
    return hash.digest("hex");
}

module.exports = { getAllRecipes, addRecipe };