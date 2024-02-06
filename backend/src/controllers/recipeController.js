const sql = require("../db/recipeSQL");
const { addRecipesKeyword, getRecipesKeywords } = require("./keywordController");
const { addRecipesIngredient, getRecipesIngredients } = require("./ingredientController");
const crypto = require("crypto");

const getAllRecipes = async (req, res) => {
    try {
        const recipes = await sql.getRecipes(req.loggedIn);
        res.status(200).json(recipes);
    } catch (error) {
        res.status(500).send();
    }
}

const getAllRecipeHashes = async (req, res) => {
    try {
        // Jos käyttäjä ei ole kirjautunut, voiko käyttäjä tietää, että reitti/resepti on olemassa?
        const hashes = await sql.getAllRecipeHashes(req.loggedIn);
        res.status(200).json(hashes);
    } catch (error) {
        res.status(500).send();
    }
}

const getRecipe = async (req, res) => {
    try {
        const { hash } = req.params;
        if (!hash) return res.status(400).send();

        // Jos käyttäjä ei ole kirjautunut, 404 vai 401 ???
        const result = await sql.getRecipes(hash, req.loggedIn);
        if (result.length !== 1) return res.status(404).send();

        let recipe = result[0];
        
        // if (recipe.visibleToAll === 0 && !req.loggedIn) return res.status(401).send();
        const ingredients = await getRecipesIngredients(recipe.id);
        recipe.ingredients = ingredients;
        const steps = await sql.getSteps(recipe.id);
        recipe.steps = steps;
        const keywords = await getRecipesKeywords(recipe.id);
        recipe.keywords = keywords;

        res.status(200).json(recipe);
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

const deleteRecipe = async (req, res) => {
    try {
        const hash = req.params.hash;
        const userId = req.user.id;

        const result = await sql.deleteRecipe(hash, userId);

        if (result.affectedRows === 0) return res.status(404).send();
        res.status(200).send();
    } catch (error) {
        res.status(500).send();
    }
}

module.exports = { getAllRecipes, getAllRecipeHashes, getRecipe, addRecipe, deleteRecipe };