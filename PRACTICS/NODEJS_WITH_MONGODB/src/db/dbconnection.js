const mongoose = require("mongoose");
const config = require("../config/config");

/* ----------------- Creat the database connection funcation ---------------- */
const connetDB = async () => {
  mongoose
    .connect(config.mongodb.url, config.mongodb.Options)
    .then((data) => {
      console.log("MongoDB Databse connection on the successfully..:)".bgGreen.bold);
    })
    .catch((error) => {
      console.log("MongoDb database connection error : ".bgRed.bold, error);
    });
};

/* ---------------------- Exports all data modules here --------------------- */
module.exports = { connetDB };
