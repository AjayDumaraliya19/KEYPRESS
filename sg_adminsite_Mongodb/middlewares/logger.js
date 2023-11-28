const log4js = require("log4js");
const logger = log4js.getLogger();

/** Configure log4js to write logs to a file */
log4js.configure({
  appenders: {
    fileAppender: { type: "file", filename: "response.log" },
  },
  categories: {
    default: { appenders: ["fileAppender"], level: "error" },
  },
});

module.exports = logger;
