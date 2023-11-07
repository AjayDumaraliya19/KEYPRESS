const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const config = require("./config/config");
const { connectDB } = require("./db/dbconnection");
// const { User, Product } = require("./models");
const router = require("./routes/v1");

/* ------------------------------ Middle wares ------------------------------ */
const app = express();
app.use(
  bodyParser.urlencoded({ extended: false })
); /** Allow form-data from the body */
app.use(express.json());
app.use(bodyParser.json()); /** Allow data form in json */
app.use(cors());
app.use("*", cors()); /** Allow to help for external resources */

/* --------------------------- Database connection -------------------------- */
connectDB();

/* -------------------------- Connect to all routes ------------------------- */
app.use("/v1", router);

/** Whenever route not create and try to use that route then throw the error */
app.use((req, res, next) => {
  next(new Error("Route not found!"));
});

/* ----------------------- Create server using express ---------------------- */
app.listen(config.port, () => {
  console.log(
    `Server listening ${config.devMode} mode at port number ${config.port}`
  );
});
