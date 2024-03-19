const { executeSQL } = require("./src/db/executeSQL");
var bcrypt = require("bcrypt");
const crypto = require("crypto");

const { users, recipes } = require("./initialValues");

const initialize = async () => {
    try {
        /* Empties the database
        await executeSQL("DELETE FROM recipe", []);
        await executeSQL("DELETE FROM user", []);
        await executeSQL("DELETE FROM email", []);
        */

        // Check if db is empty
        const init = await checkDatabase();
        if (init.length !== 0) return;

        console.log("Initializing database...");

        for (const user of users) {
            const emailResult = await addEmail(user.email);
            const passwordHash = await bcrypt.hash(user.username, 10);
            await addUser(user.username, user.name, emailResult.insertId, passwordHash, user.admin);
        }

        for (const recipe of recipes) {
            const hash = crypto.createHash("sha256").update(`${recipe.header}:${Date.now()}`).digest("hex");
            const result = await addRecipe(recipe.header, hash, recipe.description, recipe.visibleToAll, recipe.durationHours, recipe.durationMinutes, null, recipe.creator);
            if (Array.isArray(recipe.ingredients)) {
                for (const ingredient of (recipe.ingredients)) {
                    await addIngredient(ingredient.name);
                    const ingredientIdArray = await getIngredientId(ingredient.name);
                    const id = ingredientIdArray[0]["id"];
                    await addRecipesIngredient(id, ingredient.quantity, result.insertId);
                }
            }
            if (Array.isArray(recipe.keywords)) {
                for (const keyword of recipe.keywords) {
                    await addKeyword(keyword);
                    const keywordIdArray = await getKeywordId(keyword);
                    const id = keywordIdArray[0]["id"];
                    await addRecipesKeyword(id, result.insertId);
                }
            }
            if (Array.isArray(recipe.steps)) {
                recipe.steps.map(async (step, index) => (
                    await addStep(step, index + 1, result.insertId)
                ));
            }
        }

        console.log("Database initialized");
    } catch (error) {
        console.log("Error while initializing database:", error);
    }
}

const checkDatabase =  () => {
    const query = "SELECT id FROM email";
    return executeSQL(query, []);
}

const addEmail = (email) => {
    const query = "INSERT INTO email (email) values (?)";
    return executeSQL(query, [email]);
}

const addUser = (username, name, emailId, password, admin) => {
    const query = "INSERT INTO user (username, name, Email_id, password, admin, isVerified) VALUES (?,?,?,?,?,1)";
    return executeSQL(query, [username, name, emailId, password, admin]);
}

const addRecipe = (header, hash, description, visibleToAll, durationHours, durationMinutes, image, username) => {
    const query = "INSERT INTO recipe (User_id, header, hash, description, visibleToAll, durationHours, durationMinutes, created, image) SELECT id, ?, ?, ?, ?, ?, ?, NOW(), ? FROM user WHERE username = ?";
    return executeSQL(query, [header, hash, description, visibleToAll, durationHours, durationMinutes, image, username]);
}

const addIngredient = (name) => {
    const query = "INSERT IGNORE INTO ingredient (name) VALUES (?)";
    return executeSQL(query, [name]);
}

const getIngredientId = (name) => {
    const query = "SELECT id FROM ingredient WHERE name=?";
    return executeSQL(query, [name]);
}

const addRecipesIngredient = (ingredientId, quantity, recipeId) => {
    const query = "INSERT INTO recipesingredient (Ingredient_id, quantity, Recipe_id) VALUES (?,?,?)";
    return executeSQL(query, [ingredientId, quantity, recipeId]);
}

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

const addStep = (step, number, recipeId) => {
    const query = "INSERT INTO recipesteps (step, number, Recipe_id) VALUES (?,?,?)";
    return executeSQL(query, [step, number, recipeId]);
}

module.exports = { initialize };