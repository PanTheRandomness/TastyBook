const { executeSQL } = require("./executeSQL");

const verifyAdmin = (username) => {
    const query = "SELECT id FROM user WHERE username=? AND admin=1";
    return executeSQL(query, [username]);
}

const getAllUsers = () => {
    const query = "SELECT id, username, name, email FROM user";
    return executeSQL(query, []);
}

const deleteUser = (userId) => {
    const query = "DELETE FROM user WHERE id=?";
    return executeSQL(query, [userId]);
}

module.exports = { verifyAdmin, getAllUsers, deleteUser };