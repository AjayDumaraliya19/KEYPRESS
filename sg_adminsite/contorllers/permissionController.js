const logger = require("../middlewares/logger");
const {
  permissionValidationSchema,
  permissionUpdateValidationSchema,
} = require("../validation");
const validate = require("../middlewares/schemaValidation");
const {
  insertData,
  updateData,
  updateData1,
  getDataByField,
  getData,
  getDataWithoutPagi,
  ifExist,
} = require("../models/commonModel");
const { threeJoins, joinQuery } = require("../models/joinsQueryModel");
const { wutc } = require("../middlewares/utctime");
const mysql = require("mysql2/promise");
const { config } = require("../config/connection");
const tableName = "bopermission";
const tableName1 = "bopages";
const tableName2 = "boroles";

/* ------------------------ Insert Update permission ------------------------ */
const insertUpdatePermission = async (req, res) => {
  let connection = mysql.createPool(config);
  const permissionData = req.body;
  try {
    for (let i of permissionData) {
      if (
        await ifExist(
          connection,
          tableName,
          `PageId = ${i.PageId} AND  RoleId = ${i.RoleId}`
        )
      ) {
        let updating = await updateData1(
          connection,
          tableName,
          `PageId = ${i.PageId} AND  RoleId = ${i.RoleId}`,
          {
            Action: i.Action,
            ModifiedBy: req.userData.userId,
            ModifiedOn: await wutc(),
          }
        );
      } else {
        i.CreatedBy = req.userData.userId;
        delete i.PermissionId;
        let inserting = await insertData(connection, tableName, i);
        console.log(inserting);
      }
    }
    res.status(200).send({ StatusCode: 6 });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ StatusCode: 1 });
  } finally {
    connection.end();
  }
};

/* ---------------------------- Insert permission --------------------------- */
const insertPermission = async (req, res) => {
  let connection = mysql.createPool(config);
  try {
    let validData = await validate(req.body, permissionValidationSchema);
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
      "bopermission",
      `RoleId = ${req.body.RoleId} and PageId = ${req.body.PageId} and IsDelete = 0`
    );
    if (checkData.data[0].length != 0) {
      return res.status(400).send({ StatusCode: 9 });
    }
    const inserting = await insertData(connection, "bopermission", req.body);
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

/* ---------------------------- Update permission --------------------------- */
const updatePermission = async (req, res) => {
  let connection = mysql.createPool(config);
  try {
    const checkData = await getDataByField(
      connection,
      tableName,
      `PermissionId = '${req.params.PermissionId}' and IsDelete = 0`
    );
    if (checkData.data[0].length == 0) {
      return res.status(400).send({ StatusCode: 20 });
    }
    let validData = await validate(req.body, permissionUpdateValidationSchema);
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
      "bopermission",
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

/* ---------------------------- Delete permission --------------------------- */
const deletePemission = async (req, res, next) => {
  let connection = mysql.createPool(config);
  try {
    const checkData = await getDataByField(
      connection,
      tableName,
      `PermissionId = '${req.params.PermissionId}' and IsActive = 1 and IsDelete = 0`
    );
    if (checkData.data[0].length == 0) {
      return res.status(400).send({ StatusCode: 20 });
    }
    const deleting = await updateData(connection, "bopermission", req.params, {
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

/* ----------------------------- List permission ---------------------------- */
const listPermision = async (req, res) => {
  let connection = mysql.createPool(config);
  try {
    const list = await joinQuery(connection, req.body.Limit, req.body.Page);
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

/* -------------------------- Permission by Role Id ------------------------- */
const permissionByRoleId = async (req, res) => {
  let connection = mysql.createPool(config);
  try {
    const fields = `PermissionId,RoleId,PageId,Action,IsActive+0 AS IsActive,CreatedOn`;
    const list = await getDataWithoutPagi(
      connection,
      tableName,
      fields,
      `RoleId = ${req.body.RoleId} and IsActive = 1 and IsDelete = 0`
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

module.exports = {
  insertPermission,
  updatePermission,
  deletePemission,
  listPermision,
  permissionByRoleId,
  insertUpdatePermission,
};
