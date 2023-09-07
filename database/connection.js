/*
const mysql = require("mysql");

const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "Kritadhi*123",
  database: "attenendance",
  waitForConnections: true,
  connectionLimit: 10,
  multipleStatements: true
});

module.exports = pool;
*/

const mysql = require("mysql");

const pool = mysql.createPool({
  host: "sql12.freesqldatabase.com",
  user: "sql12644411",
  password: "Qwerty*123",
  database: "sql12644411",
  waitForConnections: true,
  connectionLimit: 10,
  multipleStatements: true,
});

module.exports = pool;
