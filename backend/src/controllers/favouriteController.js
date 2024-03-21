const sql = require("../db/favouriteSQL");

const addFavourite = async (req, res) => {
    try {
        const { recipeId } = req.body;
        const userId = req.user.id;

        const result = await sql.addFavourite(recipeId, userId);
        if (result.insertId === 0) return res.status(404).send();

        res.status(201).send();
    } catch (error) {
        res.status(500).send();
    }
}

const deleteFavourite = async (req, res) => {
    try {
        const { recipeId } = req.params;
        const userId = req.user.id;

        const result = await sql.deleteFavourite(recipeId, userId);
        if (result.affectedRows === 0) return res.status(404).send();

        res.status(200).send();
    } catch (error) {
        res.status(500).send();
    }
}

module.exports = { addFavourite, deleteFavourite };