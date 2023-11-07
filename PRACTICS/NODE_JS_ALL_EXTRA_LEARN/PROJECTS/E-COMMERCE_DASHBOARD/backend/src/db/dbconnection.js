const mongoose = require("mongoose");
const config = require("../config/config");

/* -------------------- Create the DB conection function -------------------- */
const connectDB = async () => {
  mongoose
    .connect(config.mongodb.url, config.mongodb.option)
    .then((data) => {
      console.log(`database Connection successfully..!`);
    })
    .catch((err) => {
      console.log(`Database connection failed..!`, err);
    });
};

module.exports = { connectDB };
