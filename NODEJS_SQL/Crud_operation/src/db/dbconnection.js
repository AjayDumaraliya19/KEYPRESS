const mysql = require("mysql2");

/* --------------- Create the connection of the mysql database -------------- */
const mysqlConnection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "yourpassword",
  database: "practics",
});

/* ---------- Create the stored procedure for the adding two number --------- */
const num1 = 19;
const num2 = 6;

/* ------------------------ Call the stored procedure ----------------------- */
mysqlConnection.query(
  "CALL addnumbers(?,?,@sum)",
  [num1, num2],
  (error, result) => {
    if (error) {
      throw error;
    }

    /* --------------- Get the Sum from the output cvariable @sum --------------- */
    mysqlConnection.query("SELECT @sum", (error, result) => {
      if (error) {
        throw error;
      }

      console.log("sum: ", result[0]["@sum"]);
    });
    mysqlConnection.end();
  }
);

module.exports = mysqlConnection;
