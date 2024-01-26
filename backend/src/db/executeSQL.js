var mysql = require("mysql");

var connection = mysql.createConnection({
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE
});

const executeSQL = (query, params) => {
    return new Promise((resolve, reject) => {
        connection.query(query, params, (error, result, fields) => {
            error ? reject(error) : resolve(result);
        });
    });
}

module.exports = { executeSQL };