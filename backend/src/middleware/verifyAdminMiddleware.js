const sql = require("../db/adminSQL");

const verifyAdmin = async (req, res, next) => {
    try {
        const admin = await sql.verifyAdmin(req.user.user);
        if (admin.length === 0) return res.status(401).send();
        next();
    } catch (error) {
        return res.status(500).send();
    }
}

module.exports = { verifyAdmin };