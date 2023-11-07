const { Product } = require("../models");

/** Create product service */
const createProduct = async (reqBody) => {
  return await Product.create(reqBody);
};

/** Get the product list */
const getProductList = async () => {
  return await Product.find();
};

module.exports = {
  createProduct,
  getProductList,
};
