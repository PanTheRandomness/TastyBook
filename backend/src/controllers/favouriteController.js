const sql = require("../db/favouriteSQL");

const addFavourite = async (req, res) => {
    try {
        const { recipeId } = req.body;
        const userId = req.user.id;

        const result = await sql.addFavourite(recipeId, userId);
        if (result.insertId === 0) return res.status(404).send();

        res.status(201).send();
    } catch (error) {
        res.status(500).send(error);
    }
}

module.exports = { addFavourite };