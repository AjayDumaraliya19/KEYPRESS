const mysql = require("mysql2/promise");
const config = require("../config/config");

/* ------------------------ Create a connection pool ------------------------ */
const pool = mysql.createPool({
  host: config.sql.host,
  port: config.sql.port,
  user: config.sql.user,
  password: config.sql.password,
  database: config.sql.database,
  multipleStatements: config.sql.multipleStatements,
  waitForConnections: config.sql.waitForConnections,
  connectionLimit: config.sql.connectionLimit,
  queueLimit: config.sql.queryLimit,
});

/* ---------------------- Ecport all data modules here ---------------------- */
module.exports = pool;
