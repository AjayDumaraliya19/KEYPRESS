const express = require("express");
const sql = require("mysql2");
const colors = require("colors");

const app = express();

/* ------------------------- Create connection pool ------------------------- */
const pool = sql.createConnection({
  host: "localhost",
  user: "root",
  password: "Admin",
  database: "emp",
});

/* ---------------------------- Connected or not ---------------------------- */
pool.connect((err) => {
  if (err) {
    console.log(`Connection error : ${err} `.bgRed);
  } else {
    console.log("SQL Database connection successfully...!".bgGreen);
  }
});

/* ------------------- Using query inside the sql database ------------------ */
pool.query("SELECT * FROM emp.employees", (error, results, fields) => {
  if (error) {
    console.error(error);
    return;
  }
  console.log(results);
  console.warn(`SQL Database query selection successfully...!`.bgCyan.black);
  pool.end();
});

/* ---------------------- Crete server by using Express --------------------- */
app.listen(3000, () => {
  console.log("Server run at port number 3000...".bgBlue);
});
