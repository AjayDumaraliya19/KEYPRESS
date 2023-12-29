import log4js from "log4js";

const logger = log4js.getLogger();

log4js.configure({
  appenders: {
    app: { type: "file", filename: "response.log" },
  },
  categories: { default: { appenders: ["app"], level: "error" } },
});

export default { logger };
