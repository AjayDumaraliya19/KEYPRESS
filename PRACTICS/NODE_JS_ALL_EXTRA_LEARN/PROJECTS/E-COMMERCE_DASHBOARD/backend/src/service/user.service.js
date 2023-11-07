const { User } = require("../models");

/* ------------------------ Create User registration ------------------------ */
const createUser = async (reqBody) => {
  return await User.create(reqBody);
};

/* --------------------------- User find by email --------------------------- */
const getUserByEmail = async (email) => {
  return await User.findOne(email).select("-password");
};

/* -------------------------- Export all data here -------------------------- */
module.exports = {
  createUser,
  getUserByEmail,
};
