const express = require("express");
const { userController } = require("../../controllers");

/** Create the router function */
const router = express.Router();

/** Create the User Register route */
router.post("/register", userController.userRegistration);

/** Login user route */
router.post("/login", userController.userLogin);

module.exports = router;
