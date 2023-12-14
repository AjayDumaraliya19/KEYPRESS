const mysql = require("mysql2/promise");
const {
  roundDetailsSchema,
  TicketDetailsSchema,
  TicketDataSchema,
} = require("../validation");
const { config } = require("../config/connection");
const validate = require("../middlewares/schemaValidation");
const { spCall, getDataByField } = require("../models/commonModel");

let tableName = "ticketinfo";

const RoundDetails = async (req, res, next) => {
  let connection = mysql.createPool(config);
  try {
    let validData = await validate(req.body, roundDetailsSchema);
    if (validData !== undefined) {
      return res.status(400).send({
        StatusCode: 15,
        error: validData,
      });
    }
    let Rd = `CALL Casino_Dealer.RoundDataByCode("${req.body.Code}");`;
    let spResult = await spCall(connection, Rd);
    if (spResult.error != null) {
      return res.status(401).send({ StatusCode: 4 });
    }
    res.status(200).json({
      StatusCode: 0,
      Data: spResult.data[0][0],
    });
  } catch (error) {
    console.log("error", error);
    res.status(401).send({ StatusCode: 1 });
  } finally {
    connection.end();
  }
};

const TicketDetails = async (req, res, next) => {
  let connection = mysql.createPool(config);
  try {
    let validData = await validate(req.body, TicketDetailsSchema);
    if (validData !== undefined) {
      return res.status(400).send({
        StatusCode: 15,
        error: validData,
      });
    }
    let td = `CALL Casino_Dealer.admin_TicketByRound("${req.body.ri}");`;
    let spResult = await spCall(connection, td);
    if (spResult.error != null) {
      return res.status(401).send({ StatusCode: 4 });
    }
    res.status(200).json({
      StatusCode: 0,
      Data: spResult.data[0],
    });
  } catch (error) {
    console.log("error", error);
    res.status(401).send({ StatusCode: 1 });
  } finally {
    connection.end();
  }
};

const ticketInfoByTicketId = async (req, res) => {
  let connection = mysql.createPool(config);
  try {
    let validData = await validate(req.body, TicketDataSchema);
    if (validData !== undefined) {
      return res.status(400).send({
        StatusCode: 15,
        error: validData,
      });
    }
    const TData = await getDataByField(
      connection,
      tableName,
      `TicketId = '${req.body.tid}'`,
      "TicketInfoId, TicketId,IP, IPInfo, DeviceInfo"
    );
    if (TData.data[0].length == 0) {
      return res.status(200).send({ StatusCode: 35 });
    }
    res.status(200).json({
      StatusCode: 0,
      Data: TData.data[0],
    });
  } catch (error) {
    console.log("error", error);
    res.status(401).send({ StatusCode: 1 });
  } finally {
    connection.end();
  }
};

module.exports = { RoundDetails, TicketDetails, ticketInfoByTicketId };
