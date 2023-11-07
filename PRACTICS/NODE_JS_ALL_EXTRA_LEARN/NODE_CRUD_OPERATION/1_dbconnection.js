const { MongoClient } = require("mongodb");
const colors = require("colors");

/** Mongodb Connection variable */
const url = "mongodb://localhost:27017";
const dbname = "Amazon";
const clname = "category";

/** Connect url */
const client = new MongoClient(url);

/** Create a connection function */
async function connectDB() {
  try {
    await client.connect();
    console.log("Connected to MongoDB...".bgGreen);
    // Get the database
    const db = client.db(dbname);
    // Get the collection
    const collection = db.collection(clname);

    return collection;
  } catch (err) {
    console.log("Error connecting to the database : ".bgRed, err);
  }
}

module.exports = connectDB;
