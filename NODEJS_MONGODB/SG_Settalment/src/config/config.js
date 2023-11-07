const Joi = require("joi");
const dotenv = require("dotenv");

/* ---------------------- Used as environment variables --------------------- */
dotenv.config();

/* --------------- Validation schema for environment variables -------------- */
const envVarsSchema = Joi.object({
  MONGODB_URL: Joi.string().trim().description("Mongodb url"),
  DATABASE_NAME: Joi.string().trim().description("MongoDB Database name"),
  COLLECTION_NAME: Joi.string().description("MongoDB collection name"),
  DB_HOST: Joi.string().trim().description("SQL host!"),
  DB_PORT: Joi.number().default(3306).description("SQL port!"),
  DB_USER: Joi.string(),
  DB_PASSWORD: Joi.string(),
  DB_DATABASE: Joi.string().trim(),
  DB_MULTIPLE_STATEMENTS: Joi.boolean(),
  DB_WAIT_FOR_CONNECTIONS: Joi.boolean(),
  CONNECTION_LIMIT: Joi.number(),
  QUERY_LIMIT: Joi.number(),
}).unknown();

/* --------------------- Environment variable validation -------------------- */
const { value: envVars, error } = envVarsSchema
  .prefs({ errors: { label: "key" } })
  .validate(process.env);

/* ----------------- Environment variable genrate the error ----------------- */
if (error) {
  console.log("Config Error: ", error);
}

/* ---------------------- Exports all data modules here --------------------- */
module.exports = {
  mongodb: {
    database_name: envVars.DATABASE_NAME,
    collection_name: envVars.COLLECTION_NAME,
    url: envVars.MONGODB_URL,
    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    },
  },
  sql: {
    host: envVars.DB_HOST,
    port: envVars.DB_PORT,
    user: envVars.DB_USER,
    password: envVars.DB_PASSWORD,
    database: envVars.DB_DATABASE,
    multipleStatements: envVars.DB_MULTIPLE_STATEMENTS,
    waitForConnections: envVars.DB_WAIT_FOR_CONNECTIONS,
    connectionLimit: envVars.CONNECTION_LIMIT,
    queryLimit: envVars.QUERY_LIMIT,
  },
};
