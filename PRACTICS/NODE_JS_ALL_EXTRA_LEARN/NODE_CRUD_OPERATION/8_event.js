const express = require("express");
const colors = require("colors");

/** Class compomnent */
const EventEmmiter = require("events");
const { count } = require("console");

const event = new EventEmmiter();

/** Create function of the event */
let Count = 0;
event.on("Count", () => {
  Count++;
  console.log("Event Call here...".bgBlue, Count);
});

/** Router app function */
const app = express();

/** Creat many routes */
app.get("/", (req, res) => {
  res.send("API called");
  event.emit("Count");
});

app.get("/serach", (req, res) => {
  res.send("API called");
  event.emit("Count");
});

app.get("/update", (req, res) => {
  res.send("API called");
  event.emit("Count");
});

/** Creat server using express */
app.listen(5000, () => {
  console.log("Server run at the port number 5000...".bgYellow.black);
});
