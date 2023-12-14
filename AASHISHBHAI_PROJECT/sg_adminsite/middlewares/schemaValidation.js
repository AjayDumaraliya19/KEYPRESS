module.exports = async (body, schema) => {
  validationSchema = schema;

  if (typeof validationSchema != "undefined") {
    const validateData = validationSchema.validate(body);

    if (validateData.error && validateData.error !== null)
      return validateData.error.message;

    // return validateData;
  }
};
