const mysql = require("mysql2");

/* --------------- Create the connection of pool for mysql database -------------- */
const Pool = mysql.createPool({
  // host: "localhost",
  // port: 3306,
  // user: "root",
  // password: "Admin",
  // database: "practics",
  // multipleStatements: true,
  // waitForConnections: true,
  // connectionLimit: 10,
  // queueLimit: 0,

  host: "51.11.109.36",
  port: 3306,
  user: "admin1",
  password: "admin@sql#2025",
  database: "Casino_Dealer",
  multipleStatements: true,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

/** Exports all data module here */
module.exports = { Pool };
