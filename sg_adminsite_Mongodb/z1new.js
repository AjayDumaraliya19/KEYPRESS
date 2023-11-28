const express = require("express");
const { MongoClient } = require("mongodb");

const app = express();
const PORT = process.env.PORT || 3000;

// MongoDB Connection
const MONGODB_URL =
  "mongodb+srv://NodeJs_Developer:Ajay1912@keypress0.lsh7zzo.mongodb.net";
const DATABASE_NAME = "SG_PROJECT";
const COLLECTION_NAME = "SG_data";

let logsCollection;

// Connect to MongoDB
MongoClient.connect(MONGODB_URL, (err, client) => {
  if (err) {
    console.error("MongoDB connection error:", err);
    return;
  }
  console.log("Connected to MongoDB");
  const db = client.db(DATABASE_NAME);
  logsCollection = db.collection(COLLECTION_NAME);

  // Define GET API endpoint to retrieve stored data
  app.get("/logsdata", async (req, res) => {
    try {
      if (!logsCollection) {
        return res
          .status(500)
          .json({ success: false, message: "Database connection error" });
      }

      // Retrieve all documents from the logs collection
      const logsData = await logsCollection.find().toArray();

      res.setHeader("Access-Control-Allow-Origin", "*"); // Allow access from any origin, adjust as needed
      res.status(200).json({ success: true, data: logsData });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  });

  // Start the server after defining the endpoint
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
});
