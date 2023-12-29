const logger = require("../middlewares/logger");
const {
  currencyValidationSchema,
  currencyUpdateValidationSchema,
} = require("../validation");
const validate = require("../middlewares/schemaValidation");
const {
  insertData,
  updateData,
  getDataByField,
  getData,
} = require("../models/commonModel");
const { wutc } = require("../middlewares/utctime");
const mysql = require("mysql2/promise");
const { config } = require("../config/connection");

const insertCurrency = async (req, res) => {
  let connection = mysql.createPool(config);
  try {
    let validData = await validate(req.body, currencyValidationSchema);
    if (validData !== undefined) {
      logger.error({
        request: JSON.stringify(req.headers),
        message: validData,
      });
      return res.status(400).send({
        StatusCode: 15,
        error: validData,
      });
    }
    req.body.CreatedBy = req.userData.userId;
    const checkData = await getDataByField(
      connection,
      "currency",
      `Name = '${req.body.Name}' and IsDelete = 0`
    );
    if (checkData.data[0].length != 0) {
      return res.status(400).send({ StatusCode: 9 });
    }
    const inserting = await insertData(connection, "currency", req.body);
    if (inserting.error) {
      return res.status(400).send({ StatusCode: 1 });
    }
    res.status(200).send({ StatusCode: 5 });
  } catch (error) {
    logger.error({ StatusCode: 1 });
    res.status(401).send({ StatusCode: 1 });
  } finally {
    connection.end();
  }
};

const updateCurrency = async (req, res) => {
  let connection = mysql.createPool(config);
  try {
    const checkData = await getDataByField(
      connection,
      "currency",
      `CurrencyId = '${req.params.CurrencyId}' and IsDelete = 0`
    );
    if (checkData.data[0].length == 0) {
      return res.status(400).send({ StatusCode: 21 });
    }
    let validData = await validate(req.body, currencyUpdateValidationSchema);
    if (validData !== undefined) {
      logger.error({
        request: JSON.stringify(req.headers),
        message: validData,
      });
      return res.status(400).send({
        StatusCode: 15,
        error: validData,
      });
    }
    req.body.ModifiedBy = req.userData.userId;
    req.body.ModifiedOn = await wutc();
    const updating = await updateData(
      connection,
      "currency",
      req.params,
      req.body
    );
    if (updating.error) {
      return res.status(400).send({ StatusCode: 1 });
    }
    res.status(200).send({ StatusCode: 6 });
  } catch (error) {
    logger.error({ StatusCode: 1 });
    res.status(401).send({ StatusCode: 1 });
  } finally {
    connection.end();
  }
};

const deleteCurrency = async (req, res, next) => {
  let connection = mysql.createPool(config);
  try {
    const checkData = await getDataByField(
      connection,
      "currency",
      `CurrencyId = '${req.params.CurrencyId}' and IsActive = 1 and IsDelete = 0`
    );
    if (checkData.data[0].length == 0) {
      return res.status(400).send({ StatusCode: 21 });
    }
    const deleting = await updateData(connection, "currency", req.params, {
      ModifiedBy: req.userData.userId,
      ModifiedOn: await wutc(),
      IsDelete: 1,
    });
    if (deleting.error) {
      return res.status(401).send({ StatusCode: 1 });
    }

    res.status(200).send({ StatusCode: 7 });
  } catch (error) {
    logger.error({ StatusCode: 1 });
    res.status(401).send({ StatusCode: 1 });
  } finally {
    connection.end();
  }
};

const listCurrency = async (req, res) => {
  let connection = mysql.createPool(config);
  try {
    const fields = `CurrencyId,Name,Code,IsActive+0 AS IsActive,CreatedOn`;
    const list = await getData(
      connection,
      "currency",
      fields,
      `IsDelete = 0`,
      req.body.Limit,
      req.body.Page,
      req.body
    );
    if (list.error) {
      return res.status(401).send({ StatusCode: 1 });
    }
    res.status(200).send({
      StatusCode: 0,
      TotalRecord: list.data.TotalRecord,
      Data: list.data.data,
    });
  } catch (error) {
    logger.error({ StatusCode: 1 });
    res.status(401).send({ StatusCode: 1 });
  } finally {
    connection.end();
  }
};

module.exports = {
  insertCurrency,
  updateCurrency,
  deleteCurrency,
  listCurrency,
};
