const sql = require("../db/recipeSQL");
const { addRecipesKeyword, getRecipesKeywords, deleteRecipesKeywords } = require("./keywordController");
const { addRecipesIngredient, getRecipesIngredients, deleteRecipesIngredients } = require("./ingredientController");
const crypto = require("crypto");
const { getReviews } = require("../db/reviewSQL");

const getAllRecipes = async (req, res) => {
    try {
        // Tähän tarkastus että keyword ja ingredient pitää olla vähintään tietyn pituisia?
        const { keyword, ingredient, username } = req.query;
        const recipes = await sql.getRecipes(null, req.loggedIn, ingredient, keyword, username);
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

const getImage = async (req, res) => {
    try {
        const { hash } = req.params;

        const result = await sql.getImage(hash, req.loggedIn);
        if (result.length === 0) return res.status(404).send();

        const image = result[0]["image"];

        const imageType = getImageType(image.slice(0, 8));

        if (imageType === "png") {
            res.setHeader("Content-Type", "image/png");
        } else if (imageType === "jpeg") {
            res.setHeader("Content-Type", "image/jpeg");
        } else return res.status(404).send();

        res.end(image);
    } catch (error) {
        res.status(500).send();
    }
}

const addRecipe = async (req, res) => {
    try {
        let { header, description, visibleToAll, durationHours, durationMinutes, steps, keywords, ingredients } = req.body;
        try {
            if (visibleToAll === "null") visibleToAll = "0";
            visibleToAll = parseInt(visibleToAll);
            durationHours = parseInt(durationHours);
            durationMinutes = parseInt(durationMinutes);
            steps = JSON.parse(steps);
            keywords = JSON.parse(keywords);
            ingredients = JSON.parse(ingredients);
            checkRecipeBody(header, description, visibleToAll, durationHours, durationMinutes, steps, keywords, ingredients);
        } catch (error) {
            return res.status(400).send();
        }

        const userId = req.user.id;

        const hash = crypto.createHash("sha256").update(`${header}:${Date.now()}`).digest("hex");

        let image = null;

        if (req.file) image = req.file.buffer;

        const result = await sql.addRecipe(userId, header, hash, description, visibleToAll, durationHours, durationMinutes, image);

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
        if (error.code === "ER_DATA_TOO_LONG") return res.status(400).send("Image too big");
        res.status(500).send();
    }
}

const deleteRecipe = async (req, res) => {
    try {
        const hash = req.params.hash;
        let userId = req.user.id;
        if (req.user.role === "admin") userId = null;

        const result = await sql.deleteRecipe(hash, userId);

        if (result.affectedRows === 0) return res.status(404).send();
        res.status(200).send();
    } catch (error) {
        res.status(500).send();
    }
}

const editRecipe = async (req, res) => {
    try {
        const hash = req.params.hash;
        let userId = req.user.id;
        if (req.user.role === "admin") userId = null;
        let { header, description, visibleToAll, durationHours, durationMinutes, steps, keywords, ingredients, id } = req.body;
        try {
            if (visibleToAll === "null") visibleToAll = "0";
            visibleToAll = parseInt(visibleToAll);
            durationHours = parseInt(durationHours);
            durationMinutes = parseInt(durationMinutes);
            steps = JSON.parse(steps);
            keywords = JSON.parse(keywords);
            ingredients = JSON.parse(ingredients);
            checkRecipeBody(header, description, visibleToAll, durationHours, durationMinutes, steps, keywords, ingredients);
        } catch (error) {
            return res.status(400).send();
        }

        let image = null;

        if (req.file) image = req.file.buffer;

        const result = await sql.editRecipe(header, description, visibleToAll, durationHours, durationMinutes, image, hash, userId);
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

const getMyRecipes = async (req, res) => {
    try {
        const userId = req.user.id;

        const result = await sql.getMyRecipes(userId);

        res.status(200).json(result);
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

    if (!Array.isArray(steps) || !steps.every(step => typeof step === "string" && step.length <= 500)) throw new Error();

    if (!Array.isArray(keywords) || !keywords.every(word => typeof word === "string" && word.length <= 45)) throw new Error();

    if (!Array.isArray(ingredients) || !ingredients.every(ingredient =>
        typeof ingredient === "object" &&
        typeof ingredient.name === "string" && ingredient.name.length <= 255 &&
        (typeof ingredient.quantity !== null || (typeof ingredient.quantity === "string" && ingredient.quantity.length <= 45))))
        throw new Error();
}

const getImageType = (imageData) => {
    // Check if the first few bytes match the PNG magic bytes
    if (imageData.length >= 8 &&
        imageData[0] === 0x89 &&
        imageData[1] === 0x50 &&
        imageData[2] === 0x4E &&
        imageData[3] === 0x47 &&
        imageData[4] === 0x0D &&
        imageData[5] === 0x0A &&
        imageData[6] === 0x1A &&
        imageData[7] === 0x0A) {
        return "png";
    }
    // Check if the first few bytes match the JPEG magic bytes
    if (imageData.length >= 3 &&
        imageData[0] === 0xFF &&
        imageData[1] === 0xD8 &&
        imageData[2] === 0xFF) {
        return "jpeg";
    }
    
    // If no match is found, return null
    return null;
}

module.exports = { getAllRecipes, getAllRecipeHashes, getRecipe, addRecipe, deleteRecipe, editRecipe, getImage, getMyRecipes };