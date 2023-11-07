const express = require("express");
const productRoute = require("./product.route");

const router = express.Router();

/* ---------------------------- Create all routes --------------------------- */
router.use("/product", productRoute);

module.exports = router;
