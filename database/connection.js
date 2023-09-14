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

/*
const mysql = require("mysql");

const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "Kritadhi*123",
  database: "freesqlonline_attendance",
  waitForConnections: true,
  connectionLimit: 10,
  multipleStatements: true
});

module.exports = pool;
*/

const mysql = require("mysql");

const pool = mysql.createPool({
  host: "attendance.clwzrtdg5hvp.ap-south-1.rds.amazonaws.com",
  user: "admin",
  password: "Kritadhi*123",
  database: "attendance",
  waitForConnections: true,
  connectionLimit: 10,
  multipleStatements: true,
});

module.exports = pool;

