const express = require("express");
const userRoutes = require("./user.route");
const authRoutes = require("./auth.route");

/* ----------------------- create the router variable ----------------------- */
const router = express.Router();

/* --------------------- Create the all router path here -------------------- */
router.use("/users", userRoutes);
router.use("/auth", authRoutes);

/* ---------------------- Exports all data modules here --------------------- */
module.exports = router;
