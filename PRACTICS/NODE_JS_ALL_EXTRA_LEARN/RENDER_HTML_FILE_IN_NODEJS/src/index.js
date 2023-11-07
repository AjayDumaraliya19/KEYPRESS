const express = require("express");
const path = require("path");
const config = require("./config/config");

/* -------------------- Create the environmental variable ------------------- */
const app = express();

/* ------------------------ Create the Path directory ----------------------- */
const publicPath = path.join(__dirname, "./public");

/** When you are Create the static pages that time you attach this type of the variable use */
// app.use(express.static(publicPath));

/* -------------------------- Set the ejs template -------------------------- */
app.set("view engine", "ejs");

/* ----------------------- Create the daynamic routes ----------------------- */
app.get("/", (req, res) => {
  res.sendFile(`${publicPath}/index.html`);
});

/** About page */
app.get("/about", (req, res) => {
  res.sendFile(`${publicPath}/about.html`);
});

/** Help page */
app.get("/help", (req, res) => {
  res.sendFile(`${publicPath}/help.html`);
});

/** Profile page */
app.get("/profile", (req, res) => {
  const user = {
    name: "John Doe",
    email: "john.doe@example.com",
    bio: "I am a software engineer.",
  };
  res.render(path.join(__dirname,"views/profile"), { user: user });
});
app.get("/login", (req, res) => {
  res.render(path.join(__dirname,"views/login"));
});

/** Page not found (404 page) */
app.get("*", (req, res) => {
  res.sendFile(`${publicPath}/PNF.html`);
});

/* -------------------- Create the server by the express -------------------- */
app.listen(config.port, () => {
  console.log(
    `${config.node_dev} server is listing port on the ${config.port}.`
  );
});
