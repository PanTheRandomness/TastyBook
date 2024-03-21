var bcrypt = require("bcrypt");
const sql = require("../db/userSQL");
const { signJWT } = require("./signJWT");
const { executeSQL } = require("../db/executeSQL");
const { v4: uuidv4 } = require("uuid");
const { verificationEmail, passwordResetEmail } = require("../utils/sendEmail");

const WORK_FACTOR = 10;

const signup = async (req, res) => {
    try {
        const { username, name, email, password, api_key } = req.body;
        if (!username || !name || !email || !password) return res.status(400).send();
        if (typeof username !== "string" || username.length > 45 || typeof name !== "string" || name.length > 45 || typeof email !== "string" || email.length > 255 || typeof password !== "string" || password.length > 255) return res.status(400).send();
        if (api_key && api_key !== process.env.ADMIN_REGISTRATION_API_KEY) return res.status(401).send();

        let result;
        let role = null;
        const passwordHash = await bcrypt.hash(password, WORK_FACTOR);
        const verificationString = uuidv4();

        try {
            await verificationEmail(email, verificationString);
        } catch (error) {
            return res.status(400).send("Invalid email");
        }

        // Tämä estää emailin tallennuksen, jos username on jo olemassa
        await executeSQL("BEGIN;");
        try {
            const emailResult = await sql.addEmail(email, verificationString);

            if (api_key) {
                result = await sql.addUser(username, name, emailResult.insertId, passwordHash, 1);
                role = "admin";
            } else {
                result = await sql.addUser(username, name, emailResult.insertId, passwordHash, null);
            }

            await executeSQL("COMMIT;");

            res.status(200).send();
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

        if (!userInfo[0]["isVerified"]) return res.status(403).send();

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

const verifyEmail = async (req, res) => {
    try {
        const { verificationString } = req.body;
        if (typeof verificationString !== "string" || verificationString.length > 255) return res.status(400).send();

        const result = await sql.verifyEmail(verificationString);

        if (result.affectedRows === 0) return res.status(401).send();

        res.status(200).send();
    } catch (error) {
        res.status(500).send();
    }
}

const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        if (typeof email !== "string" || email.length > 255) return res.status(400).send();
        const verificationString = uuidv4();

        const result = await sql.updateEmailVerification(verificationString, email);

        if (result.affectedRows === 0) return res.status(401).send();

        try {
            await passwordResetEmail(email, verificationString);
        } catch (error) {
            return res.status(400).send("Invalid email");
        }

        res.status(200).send();
    } catch (error) {
        res.status(500).send();
    }
}

const updatePassword = async (req, res) => {
    try {
        const { newPassword, verificationString } = req.body;
        if (typeof verificationString !== "string" || verificationString.length > 255 || typeof newPassword !== "string" || newPassword.length > 255) return res.status(400).send();

        const passwordHash = await bcrypt.hash(newPassword, WORK_FACTOR);

        const result = await sql.updatePassword(passwordHash, verificationString);

        if (result.affectedRows === 0) return res.status(401).send();

        res.status(200).send();
    } catch (error) {
        res.status(500).send();
    }
}

module.exports = { signup, login, getAllUsers, deleteUser, verifyEmail, forgotPassword, updatePassword };