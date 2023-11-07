const mongoose = require("mongoose");
const JWT = require("jsonwebtoken");
const config = require("../config/config");

/* ------------------------- Create the user schema ------------------------- */
const userSchema = new mongoose.Schema(
  {
    firstname: {
      type: String,
      trim: true,
      required: true,
    },
    lastname: {
      type: String,
      trim: true,
      required: true,
    },
    email: {
      type: String,
      trim: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      trim: true,
      required: true,
    },
    is_active: {
      tyep: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const User = mongoose.model("user", userSchema);

/* ---------------------- Create the user jsonwebtokan ---------------------- */
userSchema.methods.genrateAuthToken = function () {
  const token = JWT.sign({ _id: this._id }, config.jwtSecretKey, {
    expiresIn: "7d",
  });
  return token;
};

/* ----------------------- Export all data model here ----------------------- */
module.exports = User;
