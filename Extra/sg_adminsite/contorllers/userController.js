const {
  getDataByField,
  Eencrypted,
  DecryptData,
  spCall,
  insertData,
  updateData,
  getData,
} = require("../models/commonModel");
const { joinsTwoTb } = require("../models/joinsQueryModel");
const {
  usersValidationSchema,
  usersInsertValidationSchema,
  usersUpdateValidationSchema,
} = require("../validation");
const validate = require("../middlewares/schemaValidation");
const logger = require("../middlewares/logger");
const mysql = require("mysql2/promise");
const { config } = require("../config/connection");
const { v4: uuidv4 } = require("uuid");
const { wutc } = require("../middlewares/utctime");

const tableName = "bousers";
const tableName1 = "boroles";

const userCreate = async (req, res) => {
  let connection = mysql.createPool(config);
  try {
    const uuidToken = uuidv4();
    let validData = await validate(req.body, usersInsertValidationSchema);
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
    const encryptdPassword = await Eencrypted(req.body.Password);
    req.body.Password = encryptdPassword;
    req.body.Token = uuidToken;
    req.body.CreatedBy = req.userData.userId;
    req.body.TokenDateTIme = await wutc();
    const checkData = await getDataByField(
      connection,
      tableName,
      `Username = '${req.body.Username}' and IsDelete = 0`,
      "Username"
    );
    if (checkData.data[0].length != 0) {
      return res.status(400).send({
        StatusCode: 9,
      });
    }
    const checkRole = await getDataByField(
      connection,
      tableName1,
      `RoleId = '${req.body.RoleId}' and IsActive = 1 and IsDelete = 0`,
      "RoleId"
    );
    if (checkRole.data[0].length === 0) {
      return res.status(400).send({
        StatusCode: 13,
      });
    }
    const inserting = await insertData(connection, tableName, req.body);
    if (inserting.error) {
      return res.status(400).send({
        StatusCode: 1,
      });
    }
    res.status(200).send({
      StatusCode: 5,
    });
  } catch (error) {
    logger.error({
      StatusCode: 1,
    });
    res.status(401).send({
      StatusCode: 1,
    });
  } finally {
    connection.end();
  }
};

const login = async (req, res, next) => {
  let connection = mysql.createPool(config);
  try {
    const body = req.body;
    let validData = await validate(req.body, usersValidationSchema);
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
    if (body.Username && body.Password) {
      const encryptdPassword = await Eencrypted(body.Password);
      let checkLogin = `CALL Login(?, ?,?, @StatusCode);select @StatusCode as StatusCode`;
      let params = [body.Username, encryptdPassword, 1];

      let spResult = await spCall(connection, checkLogin, params);
      if (spResult.data[spResult.data.length - 1][0].StatusCode == 4) {
        return res.status(401).send({
          StatusCode: 4,
        });
      }
      if (spResult.error != null) {
        return res.status(401).send({
          StatusCode: 4,
        });
      }

      // let roleCheck = await getDataByField(connection, tableName, `Username = '${body.Username}'`, `RoleId`)
      // if (roleCheck.data[0][0].RoleId != 1) {
      //     return res.status(401).send({
      //         StatusCode: 1
      //     })
      // }
      let data = spResult.data;
      let maketkns =
        data[0][0].UserId + "/" + data[0][0].Username + "/" + data[0][0].Token;
      let encryptTokens = await Eencrypted(maketkns);
      data[3][0].Token = encryptTokens;
      data[3][0].pages = data[1];
      logger.fatal({
        request: JSON.stringify(req.headers),
        response: JSON.stringify(data[3][0]),
      });
      res.status(200).json(data[3][0]);
    }
  } catch (error) {
    logger.error({
      StatusCode: 1,
    });
    res.status(401).send({
      StatusCode: 1,
    });
  } finally {
    connection.end();
  }
};

const updateUser = async (req, res) => {
  let connection = mysql.createPool(config);
  try {
    const checkData = await getDataByField(
      connection,
      tableName,
      `UserId = '${req.params.UserId}' and IsDelete = 0`
    );
    if (checkData.data[0].length == 0) {
      return res.status(400).send({
        StatusCode: 18,
      });
    }
    let validData = await validate(req.body, usersUpdateValidationSchema);
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
      tableName,
      req.params,
      req.body
    );
    if (updating.error) {
      return res.status(400).send({
        StatusCode: 1,
      });
    }
    res.status(200).send({
      StatusCode: 6,
    });
  } catch (error) {
    console.log("error", error);
    logger.error({
      StatusCode: 1,
    });
    res.status(401).send({
      StatusCode: 1,
    });
  } finally {
    connection.end();
  }
};

const deleteUser = async (req, res, next) => {
  let connection = mysql.createPool(config);
  try {
    const checkData = await getDataByField(
      connection,
      tableName,
      `UserId = '${req.params.UserId}' and IsActive = 1 and IsDelete = 0`
    );
    if (checkData.data[0].length == 0) {
      return res.status(400).send({
        StatusCode: 18,
      });
    }
    const deleting = await updateData(connection, tableName, req.params, {
      ModifiedBy: req.userData.userId,
      ModifiedOn: await wutc(),
      IsDelete: 1,
    });
    if (deleting.error) {
      return res.status(401).send({
        StatusCode: 1,
      });
    }

    res.status(200).send({
      StatusCode: 7,
    });
  } catch (error) {
    logger.error({
      StatusCode: 1,
    });
    res.status(401).send({
      StatusCode: 1,
    });
  } finally {
    connection.end();
  }
};

const listUser = async (req, res) => {
  let connection = mysql.createPool(config);
  try {
    let field = `A.UserId, A.Username, B.Name as Role, A.IsActive+0 AS IsActive,A.CreatedOn`;
    const list = await joinsTwoTb(
      connection,
      tableName,
      "boroles",
      field,
      `B.RoleId = A.RoleId`,
      `A.IsDelete = 0`,
      req.body.Limit,
      req.body.Page,
      req.body
    );
    if (list.error) {
      console.log(list.error);
      return res.status(401).send({
        StatusCode: 1,
      });
    }

    res.status(200).send({
      StatusCode: 0,
      TotalRecord: list.data.TotalRecord,
      Data: list.data.data,
    });
  } catch (error) {
    logger.error({
      StatusCode: 1,
    });
    res.status(401).send({
      StatusCode: 1,
    });
  } finally {
    connection.end();
  }
};

module.exports = {
  userCreate,
  login,
  listUser,
  deleteUser,
  updateUser,
};
