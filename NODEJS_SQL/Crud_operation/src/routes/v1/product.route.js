const express = require("express");
const connection = require("../../db/dbconnection");

const router = express.Router();

/* -------------------- Create the data for the database -------------------- */
router.post("/create_product", (req, res) => {
  try {
    const reqBody = req.body;

    const productData = [
      reqBody.id,
      reqBody.p_name,
      reqBody.p_discription,
      reqBody.price,
      reqBody.status,
    ];

    connection.query(
      "INSERT INTO practics.products(id, p_name, p_discription, price, status) VALUE(?, ?, ?, ?, ?)",
      productData,
      (err, rows) => {
        if (!err) {
          return res.status(200).json({
            success: true,
            message: "Created data successfully :)",
            data: { productData },
          });
        } else {
          return res.status(500).json({
            success: false,
            message: "Something went wrong -!-",
          });
        }
      }
    );
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error?.message || "Routes not connected -!-",
    });
  }
});

/* --------------------- Get all data from the database --------------------- */
router.get("/products", (req, res) => {
  try {
    connection.query("SELECT * FROM practics.products", (err, rows) => {
      if (!err) {
        return res.status(200).json({
          success: true,
          message: "Get all data successfully!",
          data: rows,
        });
      } else {
        return res.status(500).json({
          success: false,
          message: err?.message || "Something went wrong -!-",
        });
      }
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error?.message || "Routes not connected -!-",
    });
  }
});

/* -------------------- Get data by Id from the database -------------------- */
router.get("/productsById/:id", (req, res) => {
  try {
    connection.query(
      "SELECT * FROM practics.products WHERE id=?",
      [req.params.id],
      (err, rows) => {
        if (!err) {
          return res.status(200).json({
            success: true,
            message: "Get data By Id successfully :)",
            data: rows,
          });
        } else {
          return res.status(500).json({
            success: false,
            message: err?.message || "Something went wrong -!-",
          });
        }
      }
    );
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error?.message || "Routes not connected -!-",
    });
  }
});

/* --------------------- Update Ddata from the database --------------------- */
router.patch("/update_data", (req, res) => {
  try {
    const reqBody = req.body;

    connection.query(
      `UPDATE practics.products SET ? WHERE id=${reqBody.id}`,
      [reqBody],
      (err, rows) => {
        if (!err) {
          return res.status(200).json({
            success: true,
            message: "Update data successfully :)",
            data: rows,
          });
        } else {
          return res.status(500).json({
            success: false,
            message: err?.message || "Something went wrong -!-",
          });
        }
      }
    );
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error?.message || "Routes not connected -!-",
    });
  }
});

/* ---------------------- Delete data form the database --------------------- */
router.delete("/deleteyId/:id", (req, res) => {
  try {
    connection.query(
      "DELETE FROM practics.products WHERE id=?",
      [req.params.id],
      (err, rows) => {
        if (!err) {
          return res.status(200).json({
            success: true,
            message: "Delete data successfully!",
          });
        } else {
          return res.send(err).json({
            success: false,
            message: err?.message || "Something went wrong -!-",
          });
        }
      }
    );
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error?.message || "Routes not connected -!-",
    });
  }
});

module.exports = router;
