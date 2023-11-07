const mysql = require("mysql2");
const config = require("../config/config");

/* ------------- Create the pool for the sql database connection ------------ */
const pool = mysql.createConnection({
  host: config.sql.host,
  port: config.sql.port,
  user: config.sql.username,
  password: config.sql.password,
  database: config.sql.database,
  multipleStatements: config.sql.multipleStatements,
  waitForConnections: config.sql.waitForConnections,
  connectionLimit: config.sql.connectionLimit,
  queueLimit: config.sql.queryLimit,
});

module.exports = pool;
