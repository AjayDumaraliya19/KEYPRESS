const mongoose = require("mongoose");

/* ------------------------- Create logsData schema ------------------------- */
const logsdataSchema = new mongoose.Schema(
  {
    ri: {
      type: Number,
    },
    plid: {
      type: Number,
    },
    ptid: {
      type: Number,
    },
    td: {
      type: Date,
      default: Date.now(),
    },
    fd: {
      type: Date,
      default: Date.now(),
    },
  },
  {
    timestamps: true,
  }
);

const Logsdata = mongoose.model("Logsdata", logsdataSchema);
module.exports = Logsdata;
