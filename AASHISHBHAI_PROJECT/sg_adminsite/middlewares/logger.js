const log4js = require("log4js");
const logger = log4js.getLogger();

log4js.configure({
  appenders: {
    app: { type: "file", filename: "response.log" },
  },
  categories: { default: { appenders: ["app"], level: "error" } },
});

module.exports = logger;
