const { MongoClient } = require("mongodb");
const config = require("../config/config");

/* ------------------- Connection of the MongoDB Database ------------------- */
const connectDB = async () => {
  const client = await MongoClient.connect(config.mongodb.url)
    .then((data) => {
      console.log("MongoDB database connection successfully!");
    })
    .catch((error) => {
      console.log("MongoDb database connection error : ", error);
    });
};

/* ---------------------- Exports all data moduels here --------------------- */
module.exports = connectDB;
