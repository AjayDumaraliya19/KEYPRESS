require("colors");
require("./db/dbconnection");
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const config = require("./config/config");
const router = require("./routes");

/* ------------------------------ Middle wares ------------------------------ */
const app = express();
app.use(
  bodyParser.urlencoded({ extended: false })
); /** Allow form-data from the body */
app.use(express.json()); /** Allow data form in json */
app.use(bodyParser.json()); /** Allow data form in json */
app.use(cors());
app.use("*", cors()); /** Allow to help for external resources */

/* ---------------------------- Route connection ---------------------------- */
app.use("/v1", router);

/* ------------------------------ Error halding ----------------------------- */
app.use((err, req, res, next) => {
  res.status(err?.status || 500).json({
    success: false,
    message: err?.message || "Internal server error",
  });
});

/* ----------------------- Create Server using express ---------------------- */
app.listen(config.port, () => {
  console.log(`${config.dev} server is running on port ${config.port}`.bgBlue);
});
