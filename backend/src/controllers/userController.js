var bcrypt = require("bcrypt");
const sql = require("../db/userSQL");
const { signJWT } = require("./signJWT");
const { executeSQL } = require("../db/executeSQL");

const signup = async (req, res) => {
    try {
        const { username, name, email, password, api_key } = req.body;
        if (!username || !name || !email || !password) return res.status(400).send();
        if (typeof username !== "string" || typeof name !== "string" || typeof email !== "string" || typeof password !== "string") return res.status(400).send();
        if (api_key && api_key !== process.env.ADMIN_REGISTRATION_API_KEY) return res.status(401).send();

        const WORK_FACTOR = 10;

        let result;
        let role = null;
        const passwordHash = await bcrypt.hash(password, WORK_FACTOR);

        // Tämä estää emailin tallennuksen, jos username on jo olemassa
        await executeSQL("BEGIN;");
        try {
            const emailResult = await sql.addEmail(email);

            if (api_key) {
                result = await sql.addUser(username, name, emailResult.insertId, passwordHash, 1);
                role = "admin";
            } else {
                result = await sql.addUser(username, name, emailResult.insertId, passwordHash, null);
            }

            await executeSQL("COMMIT;");

            const token = await signJWT(result.insertId, username, role);
            res.status(200).json({ token });
        } catch (error) {
            await executeSQL("ROLLBACK;");
            throw error;
        }
    } catch (error) {
        if (error.code === "ER_DUP_ENTRY") return res.status(409).send();
        res.status(500).send();
    }
}

const login = async (req, res) => {
    try {
        const { username, password } = req.body;
        if (!username || !password) return res.status(400).send();
        if (typeof username !== "string" || typeof password !== "string") return res.status(400).send();
        
        const userInfo = await sql.findUserInfo(username);
        if (userInfo.length === 0) return res.status(401).send();

        const isCorrect = await bcrypt.compare(password, userInfo[0]["password"]);
        if (!isCorrect) return res.status(401).send();
        
        let role = null;
        const admin = userInfo[0]["admin"];
        if (admin) role = "admin";

        const token = await signJWT(userInfo[0]["id"], username, role);
        res.status(200).json({ token });
    } catch (error) {
        res.status(500).send();
    }
}

const getAllUsers = async (req, res) => {
    try {
        const users = await sql.getAllUsers();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).send();
    }
}

const deleteUser = async (req, res) => {
    try {
        const { userId } = req.params;
        await sql.deleteUser(userId);
        res.status(200).send();
    } catch (error) {
        res.status(500).send();
    }
}

module.exports = { signup, login, getAllUsers, deleteUser };