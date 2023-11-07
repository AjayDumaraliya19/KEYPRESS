const router = require("express").Router();
const { User, validate } = require("../models/user.model");
const Joi = require("joi");
const bcrypt = require("bcryptjs");

router.post("/", async (req, res) => {
  try {
    const { error } = validate(req.body);
    if (error) {
      return res.status(400).send({ error: error.details[0].message });
    }

    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      res.status(401).send({ message: "Invalidate email or Passwors..!" });
    }

    const validPassword = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!validPassword) {
      return req
        .status(401)
        .send({ message: "Invalidate email or Passwors..!" });
    }

    const token = user.generateAuthToken();
    res.status(200).send({ data: token, message: "Logged in successfully..!" });
  } catch (error) {
    res.status(500).send({ message: "Internal server Error...!" });
  }
});

// validate: (data) => {
//   const schema = Joi.object({
//     email: Joi.string().trim().required().label("Enter your Email"),
//     password: Joi.string().trim().required().label("Enter your password"),
//   });
// };

module.exports = router;
