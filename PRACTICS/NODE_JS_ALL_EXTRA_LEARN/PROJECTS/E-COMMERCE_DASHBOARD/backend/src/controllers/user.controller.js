const { userService } = require("../service");

/* ------------------------ Create User register data ----------------------- */
const userRegistration = async (req, res) => {
  try {
    const reqBody = req.body;

    const user = await userService.createUser(reqBody);
    if (!user) {
      throw new Error("Something went wrong, please try again or later!");
    }

    const data = await user.toObject();
    delete data.password;

    res.status(200).json(data);
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

/* ------------------------------- User login ------------------------------- */
const userLogin = async (req, res) => {
  try {
    const reqBody = req.body;

    const email = reqBody.email;
    const password = reqBody.password;
    if (!email && !password) {
      throw new Error("Please provide email and password.");
    }

    const user = await userService.getUserByEmail(reqBody);
    if (!user) {
      throw new Error("NO User Found..!");
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

module.exports = {
  userRegistration,
  userLogin,
};
