var jwt = require("jsonwebtoken");

const signJWT = (userId, username, role) => {
    return new Promise((resolve, reject) => {
        jwt.sign(
            { id: userId, username: username, role: role },
            process.env.JWT_SECRET,
            { expiresIn: "2h" },
            (err, token) => {
                if (err) reject(err);
                resolve(token);
            }
        )
    });
}

module.exports = { signJWT };