const { MongoClient } = require("mongodb");
const { mongoConfig } = require("./connection");

/* ------------------- Connection of the MongoDB Database ------------------- */
const connectDB = async () => {
  try {
    const client = await MongoClient.connect(mongoConfig.url);
    console.log(client);
    console.log("MongoDB database connection successfully!");
  } catch (error) {
    console.log("MongoDb database connection error : ", error);
  }
};

/* ---------------------- Exports all data moduels here --------------------- */
module.exports = connectDB;
