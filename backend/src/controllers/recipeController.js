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
        if (typeof header !== "string" ||
            typeof description !== "string" ||
            !(visibleToAll === 0 || visibleToAll === 1) ||
            typeof durationHours !== "number" || durationHours < 0 ||
            typeof durationMinutes !== "number" || durationMinutes < 0 || durationMinutes > 59)
            return res.status(400).send();

        if (!Array.isArray(steps) || !steps.every(step => typeof step === "string")) return res.status(400).send();

        if (!Array.isArray(keywords) || !keywords.every(word=> typeof word === "string")) return res.status(400).send();

        if (!Array.isArray(ingredients) || !ingredients.every(ingredient =>
            typeof ingredient === "object" &&
            typeof ingredient.ingredient === "string" &&
            typeof ingredient.quantity === "string"))
            return res.status(400).send();

        const userId = req.user.id;

        const hash = crypto.createHash("sha256").update(`${header}:${Date.now()}`).digest("hex");

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

        res.status(201).json({ hash });
    } catch (error) {
        res.status(500).send();
    }
}

module.exports = { getAllRecipes, addRecipe };