const express = require("express");
const connectDB = require("./dbconnection");
const color = require("colors");

const app = express();

/** Database connection */
connectDB();

/** Allow data-form in the json */
app.use(express.json());

/** Create the routes od the CRUD */
// app.post("/create", (req, res) => {
//   console.log(
//     "You are very intelligent to creating a new item...".bgCyan.black
//   );
//   res.send("Creating a new item");
// });

// app.get("/getcollection", (req, res) => {
//   console.log("You are very intelligent to get a new item...".bgCyan.black);
//   res.send("Creating a new item");
// });

/** Create the server  */
app.listen(5000, () => {
  console.log("Server start at the port number is 5000...".bgBlue.yellow.bold);
});
