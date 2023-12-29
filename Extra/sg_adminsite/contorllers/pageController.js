const logger = require("../middlewares/logger");
const {
  pageValidationSchema,
  pageUpdateValidationSchema,
} = require("../validation");
const validate = require("../middlewares/schemaValidation");
const {
  insertData,
  updateData,
  getDataByField,
  getData,
  getDataWithoutPagi,
} = require("../models/commonModel");
const { wutc } = require("../middlewares/utctime");
const mysql = require("mysql2/promise");
const { config } = require("../config/connection");
let tableName = "bopages";
const insertPage = async (req, res) => {
  let connection = mysql.createPool(config);
  try {
    let validData = await validate(req.body, pageValidationSchema);
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
      "bopages",
      `Name = '${req.body.Name}' and IsDelete = 0`
    );
    if (checkData.data[0].length != 0) {
      return res.status(400).send({ StatusCode: 9 });
    }
    const inserting = await insertData(connection, "bopages", req.body);
    if (inserting.error) {
      console.log("inserting.error", inserting.error);
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

const updatePage = async (req, res) => {
  let connection = mysql.createPool(config);
  try {
    const checkData = await getDataByField(
      connection,
      tableName,
      `PageId = ${req.params.PageId} and IsDelete = 0`
    );
    if (checkData.data[0].length == 0) {
      return res.status(400).send({ StatusCode: 11 });
    }
    let validData = await validate(req.body, pageUpdateValidationSchema);
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
      "bopages",
      req.params,
      req.body
    );
    if (updating.error) {
      return res.status(400).send({ StatusCode: 1 });
    }
    res.status(200).send({ StatusCode: 6 });
  } catch (error) {
    console.log("error", error);
    logger.error({ StatusCode: 1 });
    res.status(401).send({ StatusCode: 1 });
  } finally {
    connection.end();
  }
};

const deletePage = async (req, res, next) => {
  let connection = mysql.createPool(config);
  try {
    const checkData = await getDataByField(
      connection,
      tableName,
      `PageId = '${req.params.PageId}' and IsActive = 1 and IsDelete = 0`
    );
    if (checkData.data[0].length == 0) {
      return res.status(400).send({ StatusCode: 11 });
    }
    const deleting = await updateData(connection, "bopages", req.params, {
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

const listPage = async (req, res) => {
  let connection = mysql.createPool(config);
  try {
    const fields = `PageId,Name,ParentId,DisplayName,DisplayOrder,URL,Icon,Role,IsActive+0 AS IsActive,CreatedOn`;
    const list = await getData(
      connection,
      "bopages",
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

const listPageWithoutPagination = async (req, res) => {
  let connection = mysql.createPool(config);
  let list;
  try {
    const fields = `PageId,Name,ParentId,DisplayName,DisplayOrder,URL,Icon,Role,IsActive+0 AS IsActive,CreatedOn`;
    if (req.params.list == "active") {
      list = await getDataWithoutPagi(
        connection,
        "bopages",
        fields,
        `IsActive = 1 and IsDelete = 0`
      );
      if (list.error) {
        return res.status(401).send({ StatusCode: 1 });
      }
    }

    if (req.params.list == "all") {
      list = await getDataWithoutPagi(
        connection,
        "bopages",
        fields,
        `IsDelete = 0`
      );
      if (list.error) {
        return res.status(401).send({ StatusCode: 1 });
      }
    }

    res.status(200).send({
      StatusCode: 0,
      Data: list.data[0],
    });
  } catch (error) {
    logger.error({ StatusCode: 1 });
    res.status(401).send({ StatusCode: 1 });
  } finally {
    connection.end();
  }
};

module.exports = {
  insertPage,
  updatePage,
  deletePage,
  listPage,
  listPageWithoutPagination,
};
