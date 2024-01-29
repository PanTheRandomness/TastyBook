const sql = require("../db/adminSQL");

const getAllUsers = async (req, res) => {
    try {
        const users = await sql.getAllUsers();
        res.status(200).json({ users });
    } catch (error) {
        res.status(500).send();
    }
}

const deleteUser = async (req, res) => {
    try {
        const { userId } = req.params;
        // ei poistu jos on avaimena muissa tauluissa, pitäisikö olla cascade?
        await sql.deleteUser(userId);
        res.status(200).send();
    } catch (error) {
        res.status(500).send();
    }
}

module.exports = { getAllUsers, deleteUser };