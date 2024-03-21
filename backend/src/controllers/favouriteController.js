const sql = require("../db/favouriteSQL");

const addFavourite = async (req, res) => {
    try {
        const { recipeId } = req.body;
        if (!recipeId) return res.status(400).send();
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

const getFavourites = async (req, res) => {
    try {
        const userId = req.user.id;

        const result = await sql.getFavourites(userId);

        if (result.length === 0) return res.status(404).send();

        res.status(200).json(result);
    } catch (error) {
        res.status(500).send();
    }
}

module.exports = { addFavourite, deleteFavourite, getFavourites };