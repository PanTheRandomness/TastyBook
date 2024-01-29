var bcrypt = require("bcrypt");
var jwt = require("jsonwebtoken");
const sql = require("../db/userSQL");

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
        const notEmpty = await sql.isUserTableNotEmpty();
        if (notEmpty[0]["EXISTS (SELECT 1 FROM user)"]) result = await sql.addUser(username, name, email, passwordHash);
        else result = await sql.addUser(username, name, email, passwordHash, 1);
        
        const token = await signJWT(result.insertId, username);
        res.status(200).json({ token });
    } catch (error) {
        res.status(500).send(error);
    }
}

const login = async (req, res) => {
    try {
        const { username, password } = req.body;
        if (!username || !password) return res.status(400).send();
        
        const user = await sql.findUserByUsername(username);
        if (user.length === 0) return res.status(401).send();

        const isCorrect = await bcrypt.compare(password, user[0]["password"]);
        if (!isCorrect) return res.status(401).send();

        const token = await signJWT(user[0]["id"], username);
        res.status(200).json({ token });
    } catch (error) {
        res.status(500).send();
    }
}

// Signs jwt with user's id and username
const signJWT = (userId, username) => {
    return new Promise((resolve, reject) => {
        jwt.sign(
            { id: userId, user: username },
            process.env.JWT_SECRET,
            { expiresIn: "2h" },
            (err, token) => {
                if (err) reject(err);
                resolve(token);
            }
        )
    });
}

module.exports = { signup, login };