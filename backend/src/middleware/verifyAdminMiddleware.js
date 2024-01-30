const sql = require("../db/adminSQL");

const verifyAdmin = async (req, res, next) => {
    const { role } = req.user;
    if (role !== "admin") return res.status(401).send();
    next();
}

module.exports = { verifyAdmin };