const sql = require("../db/reviewSQL");

const addReview = async (req, res) => {
    try {
        const { rating, text, recipeId } = req.body;
        if (typeof rating !== "number" || typeof text !== "string" || typeof recipeId !== "number") return res.status(400).send();

        const userId = req.user.id;

        await sql.addReview(rating, text, recipeId, userId);

        res.status(201).send();
    } catch (error) {
        // Jos sellaista reseptiä ei ollut
        if (error.code === "ER_NO_REFERENCED_ROW_2") return res.status(404).send();
        res.status(500).send();
    }
}

module.exports = { addReview };