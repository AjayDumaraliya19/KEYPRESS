const mysql = require("mysql2/promise");
const { config } = require("../config/connection");
const logger = require("../middlewares/logger");
const {
  gameAndGameDetailsValidationSchema,
  gameAndGameDetailsUpdateValidationSchema,
  GameDetailsSchema,
  TicketDetailsSchema,
} = require("../validation");
const validate = require("../middlewares/schemaValidation");
const {
  updateData,
  getData,
  updateTwoTbl,
  getDataWithoutPagi,
  getDataByField,
  spCall,
} = require("../models/commonModel");
const {
  joinsTwoTb,
  joinsTwoTbl,
  joinRounds,
} = require("../models/joinsQueryModel");
const useragent = require("useragent");
const { wutc } = require("../middlewares/utctime");
let tableName = "game";
const tb1 = "game";
const tb2 = "round";
const tb3 = "rounddetail";
const tb4 = "partnergamemap";
const tb5 = "player";
const tb6 = "runner";
const tb7 = "currency";
const tb8 = "gamedetail";
const tb9 = "ticket";
const tb10 = "playeractivity";

/* ------------------------------- Insert Game ------------------------------ */
const insertGame = async (req, res) => {
  let connection;
  try {
    const {
      Name,
      Code,
      Image,
      DisplayOrder,
      Description,
      Rules,
      StreamUrl,
      IsExposure,
      IsSound,
      GameSec,
      CardSec,
      HowToPlayUrl,
      Theme,
    } = req.body;

    let validData = await validate(
      req.body,
      gameAndGameDetailsValidationSchema
    );
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

    let insertGame = `CALL insertGame(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?, @StatusCode);select @StatusCode as StatusCode`;
    let params = [
      Name,
      Code,
      Image,
      DisplayOrder,
      Description,
      Rules,
      StreamUrl,
      HowToPlayUrl,
      IsExposure,
      IsSound,
      GameSec,
      CardSec,
      Theme,
      req.userData.userId,
    ];
    connection = mysql.createPool(config);
    const [rows, fields] = await connection.query(insertGame, params);
    if (rows[1][0].StatusCode == 9) {
      logger.fatal({
        request: JSON.stringify(req.headers),
        response: JSON.stringify(rows[1][0]),
      });
      return res.status(200).json({
        StatusCode: 9,
      });
    }

    logger.fatal({
      request: JSON.stringify(req.headers),
      response: JSON.stringify({
        StatusCode: 5,
      }),
    });
    res.status(200).json({
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

/* ------------------------------- Update Game ------------------------------ */
const updateGame = async (req, res) => {
  let connection = mysql.createPool(config);
  try {
    const checkData = await getDataByField(
      connection,
      tableName,
      `GameId = '${req.params.GameId}' and IsDelete = 0`
    );
    if (checkData.data[0].length == 0) {
      return res.status(400).send({
        StatusCode: 12,
      });
    }
    let validData = await validate(
      req.body,
      gameAndGameDetailsUpdateValidationSchema
    );
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
    const updating = await updateTwoTbl(
      connection,
      tableName,
      "gamedetail",
      req.params,
      req.body
    );
    if (updating.error) {
      console.log(updating.error);
      return res.status(400).send({
        StatusCode: 1,
      });
    }
    res.status(200).send({
      StatusCode: 6,
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

/* --------------------------- Update Game details -------------------------- */
const updateGameDetails = async (req, res, next) => {
  let connection = mysql.createPool(config);
  try {
    const checkData = await getDataByField(
      connection,
      tableName,
      `GameId = '${req.params.GameId}' and IsDelete = 0`
    );
    if (checkData.data[0].length == 0) {
      return res.status(400).send({
        StatusCode: 12,
      });
    }
    let validData = await validate(
      req.body,
      gameAndGameDetailsUpdateValidationSchema
    );
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
    const updating = await updateData(
      connection,
      "gamedetail",
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

/* ------------------------------- Delete Game ------------------------------ */
const deleteGame = async (req, res, next) => {
  let connection = mysql.createPool(config);
  try {
    const checkData = await getDataByField(
      connection,
      tableName,
      `GameId = '${req.params.GameId}' and IsActive = 1 and IsDelete = 0`
    );
    if (checkData.data[0].length == 0) {
      return res.status(400).send({
        StatusCode: 12,
      });
    }
    const deleting = await updateData(connection, tableName, req.params, {
      ModifiedBy: req.userData.userId,
      ModifiedOn: await wutc(),
      IsDelete: 1,
    });
    if (deleting.error) {
      return res.status(400).send({
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

/* ------------------------------ Get Game list ----------------------------- */
const gameList = async (req, res) => {
  let connection = mysql.createPool(config);
  try {
    const fields = `A.GameId,A.Name,A.Code,A.Image,A.DisplayOrder,A.Status,A.IsActive+0 AS IsActive,A.CreatedOn,B.Description,B.Rules,B.StreamUrl,B.HowToPlayUrl, B.IsExposure+0 AS IsExposure, B.IsSound+0 AS IsSound,B.GameSec,B.CardSec,B.Theme`;
    const list = await joinsTwoTb(
      connection,
      tableName,
      "gamedetail",
      fields,
      `B.GameId = A.GameId`,
      `A.IsDelete = 0`,
      req.body.Limit,
      req.body.Page,
      req.body
    );
    if (list.error) {
      console.log("list.error", list.error);
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

/* ------------------------- Game wihtout pagination ------------------------ */
const gameWithoutPagination = async (req, res) => {
  let connection = mysql.createPool(config);
  try {
    const fields = `GameId,Name,Code`;
    const list = await getDataWithoutPagi(
      connection,
      tableName,
      fields,
      `IsActive = 1 and IsDelete = 0`
    );
    if (list.error) {
      return res.status(401).send({
        StatusCode: 1,
      });
    }

    res.status(200).send({
      StatusCode: 0,
      Data: list.data[0],
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

/* ------------------------ Game details by Game code ----------------------- */
const gameDetailsByGameCode = async (req, res) => {
  let connection = mysql.createPool(config);
  try {
    // logger(req, 'RoundDetailsRequestHeader: ' + JSON.stringify(req.headers), 'RoundDetailsRequestIP: ' + req.ip)
    let validData = await validate(req.body, GameDetailsSchema);
    if (validData !== undefined) {
      //   logger(req, `RoundDetailsResponse: ` + JSON.stringify(validData));
      return res.status(400).send({
        StatusCode: 15,
        error: validData,
      });
    }
    const fields = `A.GameId as gi,A.Code as gc,A.Name AS nm,A.Status as st,B.Description as des,B.IsSound+0 as iss,B.GameSec as gs,B.IsExposure+0 as ise, B.CardSec as cs, JSON_EXTRACT(B.StreamUrl, '$') as stu`;
    const gameData = await joinsTwoTbl(
      connection,
      tb1,
      tb8,
      fields,
      `A.GameId = B.GameId`,
      `Code = '${req.body.Code}'`
    );
    if (gameData.data.data.length == 0) {
      //  logger(req, 'RoundDetailsResponse: ' + JSON.stringify(VALIDATION_ERROR));
      res.status(422).send({
        StatusCode: 1,
      });
    }
    const runnerData = await getDataByField(
      connection,
      tb6,
      `GameId = '${gameData.data.data[0].gi}' and IsActive = 1 and IsDelete = 0`,
      `RunnerId as rui, Name as rn, GroupId as gri, Rcode as rc`
    );
    gameData.data.data[0].stu.nanocosmos = {
      id: gameData.data.data[0].stu.nanocosmos.id,
      security: {
        jwtoken: gameData.data.data[0].stu.nanocosmos.admin,
      },
    };
    return res.status(200).json({
      StatusCode: 0,
      Data: {
        gm: gameData.data.data,
        run: runnerData.data[0],
      },
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

/* ----------------------------- Last Ten winner ---------------------------- */
const LastTenWinners = async (req, res) => {
  let connection = mysql.createPool(config);
  try {
    let validData = await validate(req.body, GameDetailsSchema);
    if (validData !== undefined) {
      //   logger(req, `RoundDetailsResponse: ` + JSON.stringify(validData));
      return res.status(400).send({
        StatusCode: 15,
        error: validData,
      });
    }

    const gameData = await getDataByField(
      connection,
      tableName,
      `Code = '${req.body.Code}' and IsActive = 1 and IsDelete = 0`,
      "GameId"
    );
    if (gameData.data[0].length == 0) {
      return res.status(400).send({
        StatusCode: 12,
      });
    }
    const win = await joinRounds(connection, gameData.data[0][0].GameId);
    if (win.data[0].length == 0) {
      return res.status(400).send({
        StatusCode: 16,
      });
    }

    return res.status(200).json({
      StatusCode: 0,
      Data: win.data,
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

/* ------------------------------- Start Game ------------------------------- */
const StartGame = async (req, res, next) => {
  let connection = mysql.createPool(config);
  try {
    // let validData = await validate(req.body, roundDetailsSchema);
    // if (validData !== undefined) {
    //     return res.status(400).send({
    //         StatusCode: 15,
    //         error: validData
    //     })
    // }
    console.log("StartGame  ");
    let SG = `CALL Casino_Dealer.admin_StartNewRoundGamewise("${req.params.GameId}","${req.userData.userId}");`;
    let spResult = await spCall(connection, SG);
    if (spResult.error != null) {
      return res.status(401).send({
        StatusCode: 4,
      });
    }
    console.log(JSON.stringify(spResult.data));
    res.status(200).json({
      StatusCode: 0,
      Data: spResult.data.Data[0],
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

/* ------------------------------ Get all Game ------------------------------ */
const Getallgame = async (req, res, next) => {
  let connection = mysql.createPool(config);
  try {
    let Rd = `call Casino_Dealer.admin_GetAllgame()`;
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
  insertGame,
  updateGame,
  updateGameDetails,
  deleteGame,
  gameList,
  gameWithoutPagination,
  gameDetailsByGameCode,
  LastTenWinners,
  StartGame,
  Getallgame,
};
