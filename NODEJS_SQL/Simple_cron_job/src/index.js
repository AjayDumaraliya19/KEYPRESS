// const cron = require("node-cron");
const express = require("express");
const { Pool } = require("./db/dbconnection");
// const { logdataFile } = require("./middlewares/upload");

const app = express.Router();

/* ---------------------- Database connection ---------------------- */
Pool.getConnection(function (err) {
  if (err) {
    console.error(
      "Database connection error: " + JSON.stringify(err.message, undefined, 2)
    );
  } else {
    console.log("Database connection successfully!");
  }
});

/* -------------- Cron job for the log file in every 5 seconds -------------- */
// cron.schedule("*/5 * * * * *", function () {
//   /** Create file and upload the file using the node-cron */
//   console.log("Scheduler started");
//   // logdataFile();
// });

app.get("/fetch", (req, res) => {
  Pool.query(
    "SELECT * FROM Casino_Dealer.settings",
    function (err, result, fileds) {
      if (err) {
        console.log(err);
      } else {
        res.send(result);
      }
    }
  );
});
