var jwt = require("jsonwebtoken");

const verifyJWT = (req, res, next) => {
    try {
        const { authorization } = req.headers;
        if (!authorization || !authorization.startsWith("Bearer ")) throw new Error();
        const token = authorization.split(" ")[1];
        if (token === undefined || token === null) throw new Error();
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).send();
    }
}

module.exports = { verifyJWT };