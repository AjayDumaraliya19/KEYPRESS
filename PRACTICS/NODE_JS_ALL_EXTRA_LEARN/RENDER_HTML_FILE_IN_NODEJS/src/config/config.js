const Joi = require("joi");
const doten = require("dotenv");

/* -------------------------- Enviromantal variable ------------------------- */
doten.config();

/* --------------------- create the enviromantal schema --------------------- */
const envVarsSchema = Joi.object({
  PORT: Joi.number().integer().default(8080).description("Port bnumbers..!"),
  NODE_DEV: Joi.string().trim(),
}).unknown();

/* -------------------- Create the values for the schema -------------------- */
const { value: envVars, error } = envVarsSchema
  .prefs({ errors: { label: "key" } })
  .validate(process.env);

/* -------------------------- If config error occur ------------------------- */
if (error) {
  console.log("config error :", error);
}

/* ---------------------- Exports all data modules here --------------------- */
module.exports = {
  port: envVars.PORT,
  node_dev: envVars.NODE_DEV,
};
