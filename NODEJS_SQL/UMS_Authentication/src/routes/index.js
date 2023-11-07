const express = require("express");
const userRoute = require("./user.route");

/** Create router function */
const router = express.Router();

/** Create all router connection here */
router.use("/users", userRoute);

/** Exports all data module here */
module.exports = router;
