require("colors");
require("./db/dbconnection");
require("./routes/createTable");
const bodyParser = require("body-parser");
const express = require("express");
const cors = require("cors");
const config = require("./config/config");

/* ------------------ Create the Express function variable ------------------ */
const app = express();

/* ----------------------- Enable CORS for all routes ----------------------- */
app.use(cors());

/* --------------- Parse incoming requests with JSON payloads --------------- */
app.use(bodyParser.json({ limit: "5mb" }));

/* ---------------- Parse incoming requests with URL-encoded ---------------- */
app.use(bodyParser.urlencoded({ extended: false, limit: "5mb" }));

/* ----------------------------- Connect routes ----------------------------- */
// app.use("/api", createTable);

/* -- Whenever route not create and try to use that route then throw error. - */
app.all("*", (req, res) => {
  return res.status(404).send({
    statusCode: 404,
    message: `Route ${req.originalUrl} Not Found`,
  });
});

/* ---------------------- Create server using expressJs --------------------- */
app.listen(config.serverPort, () => {
  console.log(
    `${config.dev} Server Run at port on ${config.serverPort}..!`.bgGreen.black
  );
});
