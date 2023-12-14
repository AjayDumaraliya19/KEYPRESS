const logger = require("../middlewares/logger");
const {
  GetRoundReportSchema,
  GetRounDetailsdReportSchema,
  GetPartnerPLSchema,
  GetTablePLSchema,
  GetPlayerPLSchema,
  GetGamePLSchema,
  GetTicketReportSchema,
  GetAllPartnerwithsearchSchema,
  GetPlayerByPartnerIdhSchema,
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

const GetPartnerPL = async (req, res, next) => {
  let connection = mysql.createPool(config);
  try {
    let validData = await validate(req.body, GetPartnerPLSchema);
    if (validData !== undefined) {
      return res.status(400).send({
        StatusCode: 15,
        error: validData,
      });
    }

    var gc = req.body.gc ? "" + req.body.gc : null;
    let Rd = `CALL Casino_Dealer.admin_PartnerPL('${req.body.ptid}', '${req.body.fd}', '${req.body.td}', ${req.body.pi}, ${req.body.ps}, '${req.body.obc}','${req.body.sd}','${req.body.tz}')`;
    let spResult = await spCall(connection, Rd);
    console.log(JSON.stringify(spResult));
    if (spResult.error != null) {
      return res.status(401).send({
        StatusCode: 4,
      });
    }
    res.status(200).json({
      StatusCode: 0,
      Data: spResult.data[0],
      Total: spResult.data[1][0],
      TotalRecord: spResult.data[2][0].TotalRecords,
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

const GetTablePL = async (req, res, next) => {
  let connection = mysql.createPool(config);
  try {
    let validData = await validate(req.body, GetTablePLSchema);
    if (validData !== undefined) {
      return res.status(400).send({
        StatusCode: 15,
        error: validData,
      });
    }

    var gc = req.body.gc ? "" + req.body.gc : null;
    let Rd = `CALL Casino_Dealer.admin_TablePL('${req.body.gid}','${req.body.ptid}', '${req.body.fd}', '${req.body.td}', ${req.body.pi}, ${req.body.ps}, '${req.body.obc}','${req.body.sd}','${req.body.tz}')`;
    let spResult = await spCall(connection, Rd);
    console.log(JSON.stringify(spResult));
    if (spResult.error != null) {
      return res.status(401).send({
        StatusCode: 4,
      });
    }
    res.status(200).json({
      StatusCode: 0,
      Data: spResult.data[0],
      Total: spResult.data[1][0],
      TotalRecord: spResult.data[2][0].TotalRecords,
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

const GetPlayerPL = async (req, res, next) => {
  let connection = mysql.createPool(config);
  try {
    let validData = await validate(req.body, GetPlayerPLSchema);
    if (validData !== undefined) {
      return res.status(400).send({
        StatusCode: 15,
        error: validData,
      });
    }

    var gc = req.body.gc ? "" + req.body.gc : null;
    let Rd = `CALL Casino_Dealer.admin_PlayerPL('${req.body.plyid}','${req.body.gid}','${req.body.ptid}', '${req.body.fd}', '${req.body.td}', ${req.body.pi}, ${req.body.ps}, '${req.body.obc}','${req.body.sd}','${req.body.tz}')`;
    let spResult = await spCall(connection, Rd);
    console.log(JSON.stringify(spResult));
    if (spResult.error != null) {
      return res.status(401).send({
        StatusCode: 4,
      });
    }
    res.status(200).json({
      StatusCode: 0,
      Data: spResult.data[0],
      Total: spResult.data[1][0],
      TotalRecord: spResult.data[2][0].TotalRecords,
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

const GetGamePL = async (req, res, next) => {
  let connection = mysql.createPool(config);
  try {
    let validData = await validate(req.body, GetGamePLSchema);
    if (validData !== undefined) {
      return res.status(400).send({
        StatusCode: 15,
        error: validData,
      });
    }

    var gc = req.body.gc ? "" + req.body.gc : null;
    let Rd = `CALL Casino_Dealer.admin_GamePL(${req.body.ri},'${req.body.plyid}','${req.body.gid}','${req.body.ptid}', '${req.body.fd}', '${req.body.td}', ${req.body.pi}, ${req.body.ps}, '${req.body.obc}','${req.body.sd}','${req.body.tz}')`;
    let spResult = await spCall(connection, Rd);
    console.log(JSON.stringify(spResult));
    if (spResult.error != null) {
      return res.status(401).send({
        StatusCode: 4,
      });
    }
    res.status(200).json({
      StatusCode: 0,
      Data: spResult.data[0],
      Total: spResult.data[1][0],
      TotalRecord: spResult.data[2][0].TotalRecords,
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

const GetTicketReport = async (req, res, next) => {
  let connection = mysql.createPool(config);
  try {
    let validData = await validate(req.body, GetTicketReportSchema);
    if (validData !== undefined) {
      return res.status(400).send({
        StatusCode: 15,
        error: validData,
      });
    }

    var gc = req.body.gc ? "" + req.body.gc : null;
    let Rd = `CALL Casino_Dealer.admin_TicketReport(${req.body.ri},'${req.body.plyid}','${req.body.gid}','${req.body.ptid}', '${req.body.fd}', '${req.body.td}', ${req.body.pi}, ${req.body.ps}, '${req.body.obc}','${req.body.sd}','${req.body.tz}')`;
    let spResult = await spCall(connection, Rd);
    console.log(JSON.stringify(spResult));
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

const GetAllPartnerwithsearch = async (req, res, next) => {
  let connection = await mysql.createPool(config);
  const { st, pi, ps } = req.body;

  try {
    let validData = await validate(req.body, GetAllPartnerwithsearchSchema);
    if (validData !== undefined) {
      return res.status(400).send({
        StatusCode: 15,
        error: validData,
      });
    }

    let Rd = `call Casino_Dealer.admin_GetAllPartner(?, ?, ?, @total_count)`;
    let spResult = await spCall(connection, Rd, [st, pi, ps]);

    let total_count = await spCall(
      connection,
      "SELECT @total_count as total_count",
      []
    );

    if (spResult.error != null) {
      return res.status(401).send({ StatusCode: 4 });
    }

    res.status(200).send({
      StatusCode: 0,
      Data: spResult.data[0],
      TotalRecord: total_count.data[0].total_count,
    });
  } catch (error) {
    console.log("error", error);
    res.status(401).send({
      StatusCode: 1,
    });
  } finally {
    await connection.end();
  }
};

const getPlayerByPartnerId = async (req, res, next) => {
  let connection = await mysql.createPool(config);
  const { ptid, st, pi, ps } = req.body;

  try {
    let validData = await validate(req.body, GetPlayerByPartnerIdhSchema);
    if (validData !== undefined) {
      return res.status(400).send({
        StatusCode: 15,
        error: validData,
      });
    }

    let Rd = `CALL Casino_Dealer.admin_GetAllPlayer(?, ?, ?, ?, @total_count_out)`;
    let spResult = await spCall(connection, Rd, [ptid, st, pi, ps]);

    let total_count = await spCall(
      connection,
      `SELECT @total_count_out as total_count`,
      []
    );

    if (spResult.error != null) {
      return res.status(401).send({ StatusCode: 4 });
    }

    res.status(200).send({
      StatusCode: 0,
      Data: spResult.data[0],
      TotalRecord: total_count.data[0].total_count,
    });
  } catch (error) {
    console.log("error", error);
    res.status(401).send({
      StatusCode: 1,
    });
  } finally {
    await connection.end();
  }
};

module.exports = {
  GetRoundReport,
  GetRounDetailsdReport,
  GetPartnerPL,
  GetTablePL,
  GetPlayerPL,
  GetGamePL,
  GetTicketReport,
  GetAllPartnerwithsearch,
  getPlayerByPartnerId,
};
