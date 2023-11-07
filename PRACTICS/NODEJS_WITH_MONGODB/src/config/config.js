const Joi = require("joi");
const dotenv = require("dotenv");

/* -------------------- create the enviromental variable -------------------- */
dotenv.config();

/* ------------------- Validation schema for the .env file ------------------ */
const envVarsschema = Joi.object({
  PORT: Joi.number().integer().default(5000),
  MONGODB_URL: Joi.string().trim().description("MongoDb URL..!"),
  NODE_ENV: Joi.string().trim().description("Node enviromental..!"),
  JWT_SECRET_KEY: Joi.string().trim().description("JWT secret key..!"),
  SALT: Joi.number().integer().description("Salt for the user password..!"),
}).unknown();

/* ------------------- Set the values for the .env schema ------------------- */
const { value: envVars, error } = envVarsschema
  .prefs({ errors: { label: "key" } })
  .validate(process.env);

/* ---------- Validation about if config connected or not connected --------- */
if (error) {
  console.log("Config error: ", error?.message);
}

/* ---------------------- Exports all data module here ---------------------- */
module.exports = {
  port: envVars.PORT,
  mongodb: {
    url: envVars.MONGODB_URL,
    Options: {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    },
  },
  node_env: envVars.NODE_ENV,
  jwtSecretKey: envVars.JWT_SECRET_KEY,
  salt: envVars.SALT,
};
