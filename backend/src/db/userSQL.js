const { executeSQL } = require("./executeSQL");

const findUserByUsername = (username) => {
    let query = "SELECT * FROM user WHERE username=?";
    return executeSQL(query, [username]);
}

// 1 if not empty, 0 if empty
const isUserTableNotEmpty = () => {
    const query = "SELECT EXISTS (SELECT 1 FROM user)";
    return executeSQL(query, []);
}

const addUser = (username, name, email, password, registrationState, admin) => {
    let params = [username, name, email, password, registrationState];
    let query = "INSERT INTO user (username, name, email, password, registrationState";
    if (admin) query += ", admin";
    query += ") VALUES (?,?,?,?,?";
    if (admin) {
        query += ",?";
        params.push(admin);
    }
    query += ")";

    return executeSQL(query, params);
}

module.exports = { findUserByUsername, isUserTableNotEmpty, addUser };