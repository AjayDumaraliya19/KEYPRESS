const express = require("express");
const { signUpvalidation } = require("../helpers/validate");
const { userController } = require("../controllers");

/** Create the router funcation */
const router = express.Router();

/** Create User registration route */
router.post("/register", signUpvalidation, userController.register);

/* ------------------------ Export modules data here ------------------------ */
module.exports = router;
