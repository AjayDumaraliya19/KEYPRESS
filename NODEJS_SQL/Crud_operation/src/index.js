const express = require("express");
const bodyParser = require("body-parser");
const config = require("./config/config");
const mysqlConnection = require("./db/dbconnection");
const routes = require("./routes/v1");

const app = express();

/* ---------------------- Allow form-data from the body --------------------- */
app.use(bodyParser.urlencoded({ extended: false }));

/* ---------------------- Allow json data from the body --------------------- */
app.use(bodyParser.json());

/* ---------------------------- Routes connection --------------------------- */
app.use("/v1", routes);

/* ---------------------- Database connection ---------------------- */
mysqlConnection.connect(function (err) {
  if (err) {
    console.error(
      "Database connection error: " + JSON.stringify(err.message, undefined, 2)
    );
  } else {
    console.log("Database connection successfully!");
  }
});

/* ---------------------- Create server by the express ---------------------- */
app.listen(config.port, () => {
  console.log(`Server run on the port no ${config.port}`);
});

let doesModifyBody = (req, res, next) => {
  res.setHeader("Content-Type", "text/html");
};

app.use(doesModifyBody);
