const { roleValidationSchema } = require("../validation");
const validate = require("../middlewares/schemaValidation");
const {
  insertData,
  updateData,
  getData,
  getDataByField,
  getDataWithoutPagi,
} = require("../models/commonModel");
const redis = require("redis");
let redisClient = redis.createClient();
const { wutc } = require("../middlewares/utctime");
const fs = require("fs");
const useragent = require("useragent");
const mysql = require("mysql2/promise");
const { config } = require("../config/connection");
const log4js = require("log4js");
const logger = log4js.getLogger();
const { logs } = require("../middlewares/log");
const path = require("path");
const tableName = "boroles";

/* ------------------------------- Insert Role ------------------------------ */
const insertRole = async (req, res) => {
  let connection = mysql.createPool(config);
  try {
    let validData = await validate(req.body, roleValidationSchema);
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
      "boroles",
      `Name = '${req.body.Name}' and IsDelete = 0`
    );
    if (checkData.data[0].length != 0) {
      return res.status(400).send({ StatusCode: 9 });
    }
    const inserting = await insertData(connection, "boroles", req.body);
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

/* ------------------------------- Update Role ------------------------------ */
const updateRole = async (req, res) => {
  let connection = mysql.createPool(config);
  try {
    // redisClient.on('error', (error) => console.log(`redis error: `+ error));
    // await redisClient.connect();
    const checkData = await getDataByField(
      connection,
      tableName,
      `RoleId = '${req.params.RoleId}' and IsDelete = 0`
    );
    if (checkData.data[0].length == 0) {
      return res.status(400).send({ StatusCode: 13 });
    }
    let validData = await validate(req.body, roleValidationSchema);
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
      "boroles",
      req.params,
      req.body
    );
    if (updating.error) {
      return res.status(400).send({ StatusCode: 1 });
    }
    // await redisClient.del('roles');
    // await redisClient.disconnect();
    res.status(200).send({ StatusCode: 6 });
  } catch (error) {
    logger.error({ StatusCode: 1 });
    res.status(401).send({ StatusCode: 1 });
  } finally {
    connection.end();
  }
};

/* ------------------------------- Delete Role ------------------------------ */
const deleteRole = async (req, res) => {
  let connection = mysql.createPool(config);
  try {
    const checkData = await getDataByField(
      connection,
      tableName,
      `RoleId = '${req.params.RoleId}' and IsActive = 1 and IsDelete = 0`
    );
    if (checkData.data[0].length == 0) {
      return res.status(400).send({ StatusCode: 13 });
    }
    const deleting = await updateData(connection, "boroles", req.params, {
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

/* -------------------------------- List Role ------------------------------- */
const listRole = async (req, res) => {
  let connection = mysql.createPool(config);
  try {
    const fields = `RoleId,Name,IsActive+0 AS IsActive,CreatedOn`;
    const list = await getData(
      connection,
      "boroles",
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

/* ------------------------- Role without pagination ------------------------ */
const roleWithoutPagination = async (req, res) => {
  let connection = mysql.createPool(config);
  try {
    const fields = `RoleId,Name`;
    const list = await getDataWithoutPagi(
      connection,
      tableName,
      fields,
      `IsActive = 1 and IsDelete = 0`
    );
    if (list.error) {
      return res.status(401).send({ StatusCode: 1 });
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

/* ------------------------------- Create test ------------------------------ */
const test = async (req, res) => {
  try {
    const { headers } = req;

    const origin = headers.origin || headers.referer || null;
    const userAgents = headers["user-agent"] || null;

    // Parse user-agent to get browser and device information
    // const browserInfo = parseUserAgent(userAgent);
    console.log("userAgent", userAgents);
    // console.log('browserInfo', browserInfo)

    console.log("-req-", req.ip);
    console.log("-ip-", req.socket.remoteAddress);
    var ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
    console.log("-ip-", ip);
    const userAgentString = req.headers["user-agent"];
    const userAgent = useragent.parse(userAgentString);
    console.log("req", userAgent);
    const deviceInfo = {
      ip: req.ip,
      platform: userAgent.os.family,
      platformVersion: userAgent.os.toVersion(),
      browser: userAgent.family,
      browserVersion: userAgent.toVersion(),
      device: userAgent.device.family,
    };
    console.log("deviceInfo", deviceInfo);
    res.status(200).send({
      StatusCode: 1,
      ip1: req.ip,
      ip2: req.socket.remoteAddress,
      ip3: ip,
      deviceInfo: deviceInfo,
      origin: origin,
      userAgents: userAgents,
    });
  } catch (error) {
    console.log("error", error);
  }
};

module.exports = {
  insertRole,
  updateRole,
  deleteRole,
  listRole,
  roleWithoutPagination,
  test,
};
