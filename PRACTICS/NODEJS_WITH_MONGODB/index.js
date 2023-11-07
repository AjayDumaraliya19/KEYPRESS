const express = require("express");
const config = require("./src/config/config");
const cors = require("cors");
const bodyparser = require("body-parser");
const {connetDB} = require("./src/db/dbconnection");
const colors = require("colors");

const app = express();

/* --------------- Allowed the form-data from the  body-parser -------------- */
app.use(bodyparser.urlencoded({ extended: true }));

/* --------------------- Allowed data inform of the json -------------------- */
app.use(bodyparser.json());

/* ---------- Handeling the forntend side error using this package ---------- */
app.use(cors());

/* ---------------------- Database connection function ---------------------- */
connetDB();

/* ------------------- Create server using the express js ------------------- */
app.listen(config.port, () => {
  console.log(`Server is running on port ${config.port}`.bgCyan.black);
});

// const connection = require("../db");
// const userRoute = require("../routes/user");
// const authRoute = require("../routes/auth");

// /** All routes */
// app.use("/api/user", userRoute);
// app.use("/api/auth", authRoute);
