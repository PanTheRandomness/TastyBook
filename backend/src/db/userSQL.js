const { executeSQL } = require("./executeSQL");

const findUserInfo = (username) => {
    let query = "SELECT id, password, admin FROM user WHERE username=?";
    return executeSQL(query, [username]);
}

const addEmail = (email) => {
    const query = "INSERT INTO email (email) VALUES (?);";
    return executeSQL(query, [email]);
}

const addUser = (username, name, emailId, password, admin) => {
    const query = "INSERT INTO user (username, name, Email_id, password, admin) VALUES (?,?,?,?,?);";
    return executeSQL(query, [username, name, emailId, password, admin]);
}

const getAllUsers = () => {
    const query = "SELECT id, username, name, email FROM user";
    return executeSQL(query, []);
}

const deleteUser = (userId) => {
    const query = "DELETE FROM user WHERE id=?";
    return executeSQL(query, [userId]);
}

module.exports = { findUserInfo, addEmail, addUser, getAllUsers, deleteUser };