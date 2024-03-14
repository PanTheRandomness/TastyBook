const sql = require("../db/recipeSQL");
const { addRecipesKeyword, getRecipesKeywords, deleteRecipesKeywords } = require("./keywordController");
const { addRecipesIngredient, getRecipesIngredients, deleteRecipesIngredients } = require("./ingredientController");
const crypto = require("crypto");
const { getReviews } = require("../db/reviewSQL");

const getAllRecipes = async (req, res) => {
    try {
        // Tähän tarkastus että keyword ja ingredient pitää olla vähintään tietyn pituisia?
        const { keyword, ingredient } = req.query;
        const recipes = await sql.getRecipes(null, req.loggedIn, keyword, ingredient);
        if (req.loggedIn) return res.status(200).json({ loggedIn: true, recipes });
        res.status(200).json({ recipes });
    } catch (error) {
        res.status(500).send();
    }
}

const getAllRecipeHashes = async (req, res) => {
    try {
        const hashes = await sql.getAllRecipeHashes(req.loggedIn);
        if (req.loggedIn) return res.status(200).json({ loggedIn: true, hashes });
        res.status(200).json({ hashes });
    } catch (error) {
        res.status(500).send();
    }
}

const getRecipe = async (req, res) => {
    try {
        const { hash } = req.params;
        if (!hash) return res.status(400).send();

        const result = await sql.getRecipes(hash, req.loggedIn);
        if (result.length === 0) return res.status(404).send();

        let recipe = result[0];
        
        const ingredients = await getRecipesIngredients(recipe.id);
        recipe.ingredients = ingredients;
        const steps = await sql.getSteps(recipe.id);
        recipe.steps = steps;
        const keywords = await getRecipesKeywords(recipe.id);
        recipe.keywords = keywords;
        const reviews = await getReviews(recipe.id);
        recipe.reviews = reviews;

        res.status(200).json(recipe);
    } catch (error) {
        res.status(500).send();
    }
}

const addRecipe = async (req, res) => {
    try {
        const { header, description, visibleToAll, durationHours, durationMinutes, steps, keywords, ingredients } = req.body;
        try {
            checkRecipeBody(header, description, visibleToAll, durationHours, durationMinutes, steps, keywords, ingredients);
        } catch (error) {
            return res.status(400).send();
        }

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

const deleteRecipeAdmin = async (req, res) => {
    try {
        const hash = req.params.hash;
        const result = await sql.deleteRecipe(hash);
        if (result.affectedRows === 0) return res.status(404).send();
        res.status(200).send();
    } catch (error) {
        res.status(500).send();
    }
}

const editRecipe = async (req, res) => {
    try {
        const hash = req.params.hash;
        const userId = req.user.id;
        const { header, description, visibleToAll, durationHours, durationMinutes, steps, keywords, ingredients, id } = req.body;
        if (!id) return res.status(400).send();
        try {
            checkRecipeBody(header, description, visibleToAll, durationHours, durationMinutes, steps, keywords, ingredients);
        } catch (error) {
            return res.status(400).send();
        }

        const result = await sql.editRecipe(header, description, visibleToAll, durationHours, durationMinutes, hash, userId);
        if (result.changedRows === 0) return res.status(404).send();

        await sql.deleteSteps(id);
        steps.map(async (step, index) => (
            await sql.addStep(step, index + 1, id)
        ));

        await deleteRecipesIngredients(id);
        ingredients.map(async (ingredient) => (
            await addRecipesIngredient(ingredient, id)
        ));

        await deleteRecipesKeywords(id);
        keywords.map(async (word) => (
            await addRecipesKeyword(word, id)
        ));

        res.status(200).send();
    } catch (error) {
        res.status(500).send();
    }
}

const checkRecipeBody = (header, description, visibleToAll, durationHours, durationMinutes, steps, keywords, ingredients) => {
    if (typeof header !== "string" || header.length > 45 ||
        typeof description !== "string" || description.length > 2000 ||
        !(visibleToAll === 0 || visibleToAll === 1) ||
        typeof durationHours !== "number" || durationHours < 0 ||
        typeof durationMinutes !== "number" || durationMinutes < 0 || durationMinutes > 59)
        throw new Error();

    if (!Array.isArray(steps) || !steps.every(step => typeof step === "string" && step.length <= 255)) throw new Error();

    if (!Array.isArray(keywords) || !keywords.every(word => typeof word === "string" && word.length <= 45)) throw new Error();

    if (!Array.isArray(ingredients) || !ingredients.every(ingredient =>
        typeof ingredient === "object" &&
        typeof ingredient.name === "string" && ingredient.name.length <= 45 &&
        typeof ingredient.quantity === "string" && ingredient.quantity.length <= 45))
        throw new Error();
}

module.exports = { getAllRecipes, getAllRecipeHashes, getRecipe, addRecipe, deleteRecipe, editRecipe, deleteRecipeAdmin };