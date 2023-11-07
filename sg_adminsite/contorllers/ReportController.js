const logger = require("../middlewares/logger");
const {
  GetRoundReportSchema,
  GetRounDetailsdReportSchema,
  GetPartnerWiseDataSchema,
} = require("../validation");
const validate = require("../middlewares/schemaValidation");
const {
  insertData,
  updateData,
  getDataByField,
  getData,
  spCall,
} = require("../models/commonModel");
const { wutc } = require("../middlewares/utctime");
const mysql = require("mysql2/promise");
const { config } = require("../config/connection");

/* ---------------------------- Get Round Report ---------------------------- */
const GetRoundReport = async (req, res, next) => {
  let connection = mysql.createPool(config);
  try {
    let validData = await validate(req.body, GetRoundReportSchema);

    if (validData !== undefined) {
      return res.status(400).send({
        StatusCode: 15,
        error: validData,
      });
    }

    var gc = req.body.gc ? "" + req.body.gc : null;
    let Rd = `CALL Casino_Dealer.admin_GetRound(${req.body.ri},${mysql.escape(
      gc
    )}, '${req.body.fd}', '${req.body.td}', ${req.body.pi}, ${req.body.ps}, '${
      req.body.obc
    }','${req.body.sd}')`;
    let spResult = await spCall(connection, Rd);

    if (spResult.error != null) {
      return res.status(401).send({
        StatusCode: 4,
      });
    }
    res.status(200).json({
      StatusCode: 0,
      Data: spResult.data[0],
      TotalRecord: spResult.data[1][0].TotalRecords,
    });
  } catch (error) {
    console.log("error", error);
    res.status(401).send({
      StatusCode: 1,
    });
  } finally {
    connection.end();
  }
};

/* ------------------------ Get Round details reports ----------------------- */
const GetRounDetailsdReport = async (req, res, next) => {
  let connection = mysql.createPool(config);
  try {
    let validData = await validate(req.body, GetRounDetailsdReportSchema);
    if (validData !== undefined) {
      return res.status(400).send({
        StatusCode: 15,
        error: validData,
      });
    }

    let Rd = `call Casino_Dealer.admin_GetRoundDetails1(${req.body.ri})`;
    let spResult = await spCall(connection, Rd);

    if (spResult.error != null) {
      return res.status(401).send({
        StatusCode: 4,
      });
    }
    res.status(200).json({
      StatusCode: 0,
      Data: spResult.data[0],
    });
  } catch (error) {
    console.log("error", error);
    res.status(401).send({
      StatusCode: 1,
    });
  } finally {
    connection.end();
  }
};

module.exports = {
  GetRoundReport,
  GetRounDetailsdReport,
};
