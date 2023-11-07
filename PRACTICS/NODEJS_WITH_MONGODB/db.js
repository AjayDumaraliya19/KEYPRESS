const mongoose = require("mongoose");

module.exports = () => {
  const connectioParams = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  };
  try {
    mongoose.connect(process.env.DB, connectioParams);
    console.log("Connection Successfully..!");
  } catch (err) {
    console.log("Connection error: ", err);
  }
};
