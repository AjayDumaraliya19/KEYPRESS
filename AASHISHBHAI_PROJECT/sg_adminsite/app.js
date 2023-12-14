require("dotenv").config();
const express = require("express");
const bodyparser = require("body-parser");
const app = express();
const PORT = process.env.PORT || 7700;
const route = require("./routes/routes");
const cors = require("cors");

app.get("/", (req, res) => {
  res.send("Api Working!");
});
app.use(cors());
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: true }));
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
    return res.status(200).json({});
  }
  next();
});

app.use("/", route);

const server = app.listen(PORT, () => {
  console.log("server started on:", PORT);
});
