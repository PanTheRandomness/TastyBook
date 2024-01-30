const { executeSQL } = require("./executeSQL");

const getAllUsers = () => {
    const query = "SELECT id, username, name, email FROM user";
    return executeSQL(query, []);
}

const deleteUser = (userId) => {
    const query = "DELETE FROM user WHERE id=?";
    return executeSQL(query, [userId]);
}

module.exports = { getAllUsers, deleteUser };