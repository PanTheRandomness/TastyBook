const { executeSQL } = require("./executeSQL");

const findUserInfo = (username) => {
    let query = "SELECT id, password, admin, isVerified FROM user WHERE username=?";
    return executeSQL(query, [username]);
}

const addEmail = (email, verificationString) => {
    const query = "INSERT INTO email (email, verificationString) VALUES (?,?);";
    return executeSQL(query, [email, verificationString]);
}

const addUser = (username, name, emailId, password, admin) => {
    const query = "INSERT INTO user (username, name, Email_id, password, admin) VALUES (?,?,?,?,?);";
    return executeSQL(query, [username, name, emailId, password, admin]);
}

const getAllUsers = () => {
    const query = "SELECT u.id, u.username, u.name, e.email, u.admin FROM user u LEFT JOIN email e ON u.Email_id=e.id";
    return executeSQL(query, []);
}

const deleteUser = (userId) => {
    const query = "DELETE FROM user WHERE id=?";
    return executeSQL(query, [userId]);
}

const verifyEmail = (verificationString) => {
    const query = "UPDATE user u LEFT JOIN email e ON u.Email_id=e.id SET u.isVerified=1 WHERE e.verificationString=?";
    return executeSQL(query, [verificationString]);
}

const updateEmailVerification = (verificationString, email) => {
    const query = "UPDATE email SET verificationString=? WHERE email=?";
    return executeSQL(query, [verificationString, email]);
}

const updatePassword = (password, verificationString) => {
    const query = "UPDATE user u LEFT JOIN email e ON u.Email_id=e.id SET password=? WHERE e.verificationString=?";
    return executeSQL(query, [password, verificationString]);
}

module.exports = { findUserInfo, addEmail, addUser, getAllUsers, deleteUser, verifyEmail, updateEmailVerification, updatePassword };