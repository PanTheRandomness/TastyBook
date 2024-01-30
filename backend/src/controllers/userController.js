var bcrypt = require("bcrypt");
const sql = require("../db/userSQL");
const { signJWT } = require("./signJWT");

const signup = async (req, res) => {
    try {
        const { username, name, email, password } = req.body;
        if (!username || !name || !email || !password) return res.status(400).send();

        // Checks if user already exists
        const duplicateUser = await sql.findUserByUsernameAndEmail(username, email);
        if (duplicateUser.length > 0) return res.status(409).send();

        const WORK_FACTOR = 10;
        const passwordHash = await bcrypt.hash(password, WORK_FACTOR);

        // Adds user as admin if user table is empty
        let result;
        let role = null;
        const notEmpty = await sql.isUserTableNotEmpty();
        if (notEmpty[0]["EXISTS (SELECT 1 FROM user)"]) result = await sql.addUser(username, name, email, passwordHash, null);
        else {
            result = await sql.addUser(username, name, email, passwordHash, 1);
            role = "admin";
        }
        
        const token = await signJWT(result.insertId, username, role);
        res.status(200).json({ token });
    } catch (error) {
        res.status(500).send();
    }
}

const login = async (req, res) => {
    try {
        const { username, password } = req.body;
        if (!username || !password) return res.status(400).send();
        
        const user = await sql.findUserByUsernameAndEmail(username);
        if (user.length === 0) return res.status(401).send();

        const isCorrect = await bcrypt.compare(password, user[0]["password"]);
        if (!isCorrect) return res.status(401).send();
        
        let role = null;
        const admin = user[0]["admin"];
        if (admin) role = "admin";

        const token = await signJWT(user[0]["id"], username, role);
        res.status(200).json({ token });
    } catch (error) {
        res.status(500).send();
    }
}

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

module.exports = { signup, login, getAllUsers, deleteUser };