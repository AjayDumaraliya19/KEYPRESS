const express = require("express");
const { prosuctController, productController } = require("../../controllers");

/** Create the router function */
const router = express.Router();

/** Create product route */
router.post("/createProduct", productController.createProduct);

/** Get product list route */
router.get("/productList", productController.getProductList);

module.exports = router;
