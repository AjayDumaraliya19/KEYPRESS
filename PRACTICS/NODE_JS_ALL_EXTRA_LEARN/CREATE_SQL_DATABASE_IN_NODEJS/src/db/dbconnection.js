const mysql = require("mysql2");
const config = require("../config/config");

/* ------------- Create the pool for the sql database connection ------------ */
const pool = mysql.createPool({
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

/* --------------------------- Database connection -------------------------- */
pool.getConnection(async function () {
  try {
    /** This will throw an error if there is a problem with the connection */
    await pool.promise();
    console.log(
      `MySQL ${config.sql.database} database connection successfully..!`
        .bgYellow
    );
  } catch (err) {
    console.error(
      "Database connection error: " + JSON.stringify(err.message, undefined, 2)
    );
  }
});
