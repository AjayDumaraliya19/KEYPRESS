const Joi = require("joi");
const dotenv = require("dotenv");

/** Create the Environment variable */
dotenv.config();

/** Creart the schema for the environmental variable */
const envVarsSchema = Joi.object({
  PORT: Joi.number().integer().default(8080).description("Env port..!"),
  MONGODB_URL: Joi.string().trim().description("MongoDB URL..!"),
  DEV_MODE: Joi.string().trim().description("DEvelopemode..!"),
}).unknown();

/** Validate the environment variables against the schema */
const { value: envVars, error } = envVarsSchema
  .prefs({ errors: { label: "key" } })
  .validate(process.env);

if (error) {
  console.log(`Config error : ${error}`);
}

/** Exports all modules data here */
module.exports = {
  port: envVars.PORT,
  mongodb: {
    url: envVars.MONGODB_URL,
    option: {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    },
  },
  devMode: envVars.DEV_MODE,
};
