const Joi = reqire("joi");
const passwordComplexity = require("joi-password-complexity");

/* ----------------------- Create the user validation ----------------------- */
const createUser = {
  body: Joi.object({
    firstname: Joi.string()
      .trim()
      .required()
      .label("First name is required..!"),
    lastname: Joi.string().trim().required().label("Last name is required..!"),
    email: Joi.string()
      .trim()
      .email()
      .unique()
      .lowercase()
      .reqired()
      .label("Email must be required..!"),
    password: passwordComplexity()
      .required()
      .label("Password must be required..!"),
  }),
};

module.exports = {
  createUser,
};
