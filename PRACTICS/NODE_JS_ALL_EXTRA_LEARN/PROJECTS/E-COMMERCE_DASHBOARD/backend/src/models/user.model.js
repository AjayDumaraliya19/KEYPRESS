const mongoose = require("mongoose");

/* --------------------- Create the schema for the user --------------------- */
const userSchema = new mongoose.Schema(
  {
    fname: {
      type: String,
      trim: true,
      required: true,
    },
    // lname: {
    //   type: String,
    //   trim: true,
    //   required: true,
    // },
    email: {
      type: String,
      trim: true,
      required: true,
    },
    password: {
      type: String,
      trim: true,
      required: true,
    },
    // phone: {
    //   type: Number,
    //   required: true,
    // },
    // address: {
    //   type: String,
    //   trim: true,
    //   required: true,
    // },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const User = mongoose.model("user", userSchema);

module.exports = User;
