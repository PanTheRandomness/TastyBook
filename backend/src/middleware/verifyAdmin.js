const verifyAdmin = (req, res, next) => {
    const { role } = req.user;
    if (role !== "admin") return res.status(401).send();
    next();
}

module.exports = { verifyAdmin };