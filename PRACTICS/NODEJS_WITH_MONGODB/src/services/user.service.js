const { User } = require("../models");

/* ------------------------- Create the user serivce ------------------------ */
const createUser = async (reqBody) => {
  return User.create(reqBody);
};

/* ---------------------- Exports all data modules here --------------------- */
module.exports = {
  create,
};
