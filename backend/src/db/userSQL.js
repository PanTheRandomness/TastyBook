const { executeSQL } = require("./executeSQL");

const findUserByUsernameAndEmail = (username, email) => {
    let params = [username];
    let query = "SELECT * FROM user WHERE username=?";
    if (email) {
        params.push(email);
        query += " OR email=?";
    }
    return executeSQL(query, params);
}

const addUser = (username, name, email, password, admin) => {
    const query = "INSERT INTO user (username, name, email, password, admin) VALUES (?,?,?,?,?)";
    return executeSQL(query, [username, name, email, password, admin]);
}

const getAllUsers = () => {
    const query = "SELECT id, username, name, email FROM user";
    return executeSQL(query, []);
}

const deleteUser = (userId) => {
    const query = "DELETE FROM user WHERE id=?";
    return executeSQL(query, [userId]);
}

module.exports = { findUserByUsernameAndEmail, addUser, getAllUsers, deleteUser };