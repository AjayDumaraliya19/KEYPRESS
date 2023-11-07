require("colors");
const Joi = require("joi");
const dotenv = require("dotenv");

/* ---------------------- Used as environment variables --------------------- */
dotenv.config();

/* --------------- Validation schema for environment variables -------------- */
const envVarsSchema = Joi.object({
  NODE_DEV: Joi.string().trim().description(`Development mode..!`),
  SERVER_PORT: Joi.number().integer().description(`Runnig server port..!`).default(4000),
  DB_HOST: Joi.string().trim().description(`Database Hosting Port..!`),
  DB_PORT: Joi.number().integer().description(`Running port..!`),
  DB_USER: Joi.string().trim().description(`Database user name..!`),
  DB_PASSWORD: Joi.string().trim().description(`Database User password..!`),
  DB_DATABASE: Joi.string().trim().description(`Database name..!`),
  DB_MULTIPLE_STATEMENTS: Joi.boolean().description(`Statements status..!`),
  DB_WAIT_FOR_CONNECTIONS: Joi.boolean().description(`Connection status..!`),
  CONNECTION_LIMIT: Joi.number().integer().description(`Connection limit..!`),
  QUERY_LIMIT: Joi.number().integer().description(`database Query limit..!`),
}).unknown();

/* --------------------- Environment variable validation -------------------- */
const { value: envVars, error } = envVarsSchema
  .prefs({ errors: { label: "key" } })
  .validate(process.env);

/* ----------------- Environment variable genrate the error ----------------- */
if (error) {
  console.log(`Config error : ${error}`.bgRed);
}

/* ------------------------ Exports all modules data ------------------------ */
module.exports = {
  dev: envVars.NODE_DEV,
  serverPort: envVars.SERVER_PORT,
  sql: {
    host: envVars.DB_HOST,
    port: envVars.DB_PORT,
    username: envVars.DB_USER,
    password: envVars.DB_PASSWORD,
    database: envVars.DB_DATABASE,
    multipleStatements: envVars.DB_MULTIPLE_STATEMENTS,
    waitForConnections: envVars.DB_WAIT_FOR_CONNECTIONS,
    connectionLimit: envVars.CONNECTION_LIMIT,
    queryLimit: envVars.QUERY_LIMIT,
  },
};
