const { MongoClient } = require("mongodb");
const { mongoConfig } = require("./connection");

// /* ------------------- Connection of the MongoDB Database ------------------- */
const connectDB = async () => {
  try {
    const client = new MongoClient(mongoConfig.url);
    console.log("MongoDB database connection successfully!");
    return client;
  } catch (error) {
    console.log("MongoDb database connection error : ", error);
  }
};

module.exports = connectDB;
