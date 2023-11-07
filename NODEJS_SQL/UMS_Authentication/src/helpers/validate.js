const { check } = require("express-validator");

/* ----------------- Create the function for the validation ----------------- */
const signUpvalidation = [
  check("name", "Name is required..!").not().isEmpty(),
  check("email", "Please enter validate email..!")
    .isEmail()
    .normalizeEmail({ gmail_remove_dots: true }),
  check("password", "Password is required..!").isLength({ min: 6 }),
];

/* ---------------------- Exports all data mmodule here --------------------- */
module.exports = {
  signUpvalidation,
};
