const { productService } = require("../service");

/* ----------------------------- Create Product ----------------------------- */
const createProduct = async (req, res) => {
  try {
    const reqBody = req.body;

    const product = await productService.createProduct(reqBody);
    if (!product) {
      throw new Error("Something went wrong, please try again or later!");
    }

    res.status(200).json({ product });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

/* ---------------------- Create the gdet Product list ---------------------- */
/* Get Product list */
const getProductList = async (req, res) => {
  try {
    const getList = await productService.getProductList();

    res.status(200).json({
      success: true,
      message: "Get product list Successfully!",
      data: getList,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
/* ---------------------- Exports all data modules here --------------------- */
module.exports = {
  createProduct,
  getProductList,
};
