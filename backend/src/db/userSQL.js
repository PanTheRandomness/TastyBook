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

// 1 if not empty, 0 if empty
const isUserTableNotEmpty = () => {
    const query = "SELECT EXISTS (SELECT 1 FROM user)";
    return executeSQL(query, []);
}

const addUser = (username, name, email, password, admin) => {
    let params = [username, name, email, password];
    let query = "INSERT INTO user (username, name, email, password";
    if (admin) query += ", admin";
    query += ") VALUES (?,?,?,?";
    if (admin) {
        query += ",?";
        params.push(admin);
    }
    query += ")";

    return executeSQL(query, params);
}

module.exports = { findUserByUsernameAndEmail, isUserTableNotEmpty, addUser };