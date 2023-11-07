const mongoose = require("mongoose");
const JWT = require("jsonwebtoken");
const Joi = require("joi");
const passwordComplexity = require("joi-password-complexity");

const userSchema = new mongoose.Schema(
  {
    firstname: { type: String, required: true },
    lastname: { type: String, required: true },
    email: { type: String, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

userSchema.methods.genrateAuthToken = function () {
  const token = JWT.sign({ _id: this._id }, process.env.JWT_SECRET_KEY, {
    expiresIn: "7d",
  });
  return token;
};

const validate = (data) => {
  const schema = Joi.object({
    firstname: Joi.string()
      .trim()
      .required()
      .label("First name must be required..!"),
    lastname: Joi.string()
      .trim()
      .required()
      .label("Last name must be required..!"),
    email: Joi.string().trim().required().label("Email must be required..!"),
    password: passwordComplexity()
      .required()
      .label("Password must be required..!"),
  });
  return schema.validate(data);
};

const User = mongoose.model("user", userSchema);

module.exports = { User, validate };
