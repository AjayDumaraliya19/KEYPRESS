import Joi from "joi";
import dotenv from "dotenv";
import logger from "../middlewares/logger.js";

dotenv.config();

const envVarsSchema = Joi.object({
  PORT: Joi.number().integer().default(4000),
  MONGODB_URL: Joi.string().trim().description(`Mongodb url..!`),
  DATABASE_NAME: Joi.string().trim().description("Mongodb database name..!"),
}).unknown();

const { value: envVars, error } = envVarsSchema
  .prefs({ errors: { label: "key" } })
  .validate(process.env);

if (error) {
  logger.error({
    request: JSON.stringify(req.header),
    message: error,
  });
  res.status(400).send({
    StatusCode: 11,
  });
}

const configData = {
  port: envVars.PORT,
  mongodb: {
    url: envVars.MONGODB_URL,
    Option: {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    },
    dbName: envVars.DATABASE_NAME,
  },
};

export default configData;
