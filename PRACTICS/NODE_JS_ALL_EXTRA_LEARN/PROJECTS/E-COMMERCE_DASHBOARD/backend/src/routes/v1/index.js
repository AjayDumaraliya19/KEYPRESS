const express = require("express");
const userRoute = require("./user.route");
const productRoute = require("./product.route");

/** Create router function */
const router = express.Router();

/** Create the all route here */
router.use("/user", userRoute);
router.use("/product", productRoute);

/** Export all data module here */
module.exports = router;
