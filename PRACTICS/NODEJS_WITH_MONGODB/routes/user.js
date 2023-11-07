const router = require("express").Router();
const { User, validate } = require("../models/user.model");
const bcrypt = require("bcryptjs");

router.post("/", async (req, res) => {
  try {
    const { error } = validate(req.body);

    if (error) {
      return res.status(400).send({ error: error.details[0].message });
    }
    const user = await User.findOne({ email: req.body.email });

    if (user) {
      return res.status(400).send({ error: "Email already registered" });
    }

    const salt = bcrypt.genSaltSync(process.env.SALT);
    const hashPassword = await bcrypt.hashSync(req.body.password, salt);

    await new user({ ...req.body, password: hashPassword }).save();
    res
      .status(201)
      .send({ success: true, message: "User created successfully..!" });
  } catch (err) {
    res.status(400).send({ success: false, message: "User not found..!" });
  }
});

module.exports = router;
