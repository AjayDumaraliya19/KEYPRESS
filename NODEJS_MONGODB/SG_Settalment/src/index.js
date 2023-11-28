const axios = require("axios");
const { MongoClient } = require("mongodb");
const { pool, connectDB } = require("./db");
const { loggerdata } = require("./services/logger");
const config = require("./config/config");
const {
  addTransaction,
  updateTransaction,
  rollback,
  Credit,
  updateData1,
} = require("./services/Comman");

/** Define a function to call the stored procedure and send the data to the REST API */
async function fetchDataFromMySQL(connection) {
  // const [rows, fields] = await connection.execute(
  //   "CALL Casino_Dealer.Player_Settlement()"
  // );

  // const data = rows[0];

  const data = [
    {
      ri: 34522,
      Status: 3,
      winlist: [
        { gri: 1, rni: 2 },
        { gri: 2, rni: 3 },
      ],
      playerlist: [
        {
          ce: -1.1,
          tl: [
            { pl: 9.8, tid: 4914, isWon: 1 },
            { pl: -10.5, tid: 4915, isWon: 0 },
            { pl: 8.2, tid: 4916, isWon: 1 },
            { pl: -8.6, tid: 4917, isWon: 0 },
          ],
          pid: 7,
          pdata: {
            Pldata: {
              cc: "AUD",
              pln: "Demo11",
              plid: 7,
              plst: "0443b80c-96b1-435b-a69c-fe30f796312e",
            },
            Ptdata: {
              ba: "https://partnerapi.elexamover.com/balance",
              ca: "https://partnerapi.elexamover.com/credit",
              ra: "https://partnerapi.elexamover.com/rollback",
              ptn: "Demo",
              plsk: "7c601500-4a4d-4d19-a15e-3d4caa2e247a",
              ptid: 1,
            },
          },
          stype: 1,
        },
      ],
      Game: { gc: "TP", gn: "Teen Patti", gid: 1 },
    },
  ];

  const formattedData = data.map(async (rounddata) => {
    return await Promise.all(
      rounddata.playerlist.map(async (playerdata) => {
        try {
          const response = await axios.get(playerdata.pdata.Ptdata.ca);
          const responseData = response.data;

          const formattedObject = {
            ri: rounddata.ri,
            gid: rounddata.Game.gid,
            pid: playerdata.pid,
            plid: playerdata.pdata.Pldata.plid,
            URL: playerdata.pdata.Ptdata.ba,
            req: { data: playerdata.pdata },
            res: responseData,
            ts: new Date().toISOString(),
          };

          return formattedObject;
        } catch (error) {
          console.error("Error fetching data from URL:", error);
          throw error;
        }
      })
    );
  });

  try {
    const formattedResults = (await Promise.all(formattedData)).flat();
    return formattedResults;
  } catch (error) {
    console.error("Error fetching data from MySQL:", error);
    throw error;
  } finally {
    await updateRound(connection, data);
    await connection.release();
  }
}

/* --------------------- Savedata in to MongoDB Database -------------------- */
async function saveDataToMongoDB(client, data) {
  if (data.length === 0) {
    console.warn("Data is empty. Skipping MongoDB insert...");
    return;
  }
  /* --------------------------------- Changes -------------------------------- */
  client = await MongoClient.connect(config.mongodb.url);

  try {
    const db = client.db(config.mongodb.database_name);
    const collection = db.collection(config.mongodb.collection_name);

    await collection.insertMany(data);
    console.log("Data saved to MongoDB");
  } catch (error) {
    console.error("Error saving data to MongoDB:", error);
    throw error;
  }
}

/* ----------------------- Fetch data and send to API ----------------------- */
async function fetchDataAndSendToAPI() {
  const connection = await pool.getConnection();
  const client = await connectDB();

  try {
    const mysqlData = await fetchDataFromMySQL(connection);
    await saveDataToMongoDB(client, mysqlData);
  } catch (error) {
    console.error(
      "Error fetching data from MySQL, sending data to API, or other operation:",
      error
    );
  } finally {
    await connection.release();
  }
}

/* ---------------------------- Update game round --------------------------- */
async function updateRound(connection, data) {
  await Promise.all(
    data.map(async (rounddata) => {
      await Promise.all(
        rounddata.playerlist.map(async (playerdata) => {
          await SendToPartner(
            connection,
            rounddata.ri,
            rounddata.Status,
            playerdata,
            rounddata.Game
          );
        })
      );
    })
  );
}

/* ---------------------------- Get Data From DB ---------------------------- */
async function SendToPartner(connection, ri, Status, playerdata, game) {
  if (playerdata.stype) {
    if (Status == 3) {
      const winround = {
        totalPL: 0,
        betList: playerdata.tl,
      };
      winround.totalPL = winround.betList.reduce(
        (total, bet) => total + bet.pl,
        0
      );
      const totalReturnToPartner = -playerdata.ce - -winround.totalPL;
      await updateplayer(
        connection,
        ri,
        playerdata,
        game,
        totalReturnToPartner,
        null
      );
    } else if (Status == 5) {
      const winround = {
        totalPL: 0,
        betList: playerdata.tl,
      };
      winround.totalPL = winround.betList.reduce(
        (total, bet) => total + bet.pl,
        0
      );
      const totalReturnToPartner = -winround.totalPL;
      await updatecancelplayer(
        connection,
        ri,
        playerdata,
        game,
        totalReturnToPartner,
        null
      );
    }
  } else {
    if (Status == 3) {
      await playerdata.tl.forEach(async (ticketdata) => {
        await updateplayer(
          connection,
          ri,
          playerdata,
          game,
          ticketdata.pl,
          ticketdata.tid.toString()
        );
      });
    } else if (Status == 5) {
      await playerdata.tl.forEach(async (ticketdata) => {
        await updatecancelplayer(
          connection,
          ri,
          playerdata,
          game,
          ticketdata.pl,
          ticketdata.tid.toString()
        );
      });
    }
  }
}

/* ------------------------- Update the player data ------------------------- */
async function updateplayer(
  connection,
  ri,
  playerdata,
  game,
  totalReturnToPartner,
  tid
) {
  let TransactionObj;
  let objDebitTransaction;
  let CreditReq;
  let Creditres;
  let rollbackres;
  let objrollbackTransaction;
  let objupdateTransaction;

  let timejson = {
    TransactionObj: null,
    objDebitTransaction: null,
    CreditReq: null,
    Creditres: null,
    rollbackres: null,
    objrollbackTransaction: null,
    objupdateTransaction: null,
  };

  try {
    TransactionObj = {
      PlayerId: playerdata.pdata.Pldata.plid,
      PartnerId: playerdata.pdata.Ptdata.ptid,
      TransactionType: 2,
      Amount: totalReturnToPartner.toFixed(2),
      Status: 0,
      RoundId: ri,
      TicketId: tid,
      CreatedBy: playerdata.pdata.Pldata.plid,
    };

    timejson.TransactionObj = new Date().toISOString();

    objDebitTransaction = await addTransaction(connection, TransactionObj);

    timejson.objDebitTransaction = new Date().toISOString();

    CreditReq = {
      player: {
        id: playerdata.pdata.Pldata.pln,
        currency: playerdata.pdata.Pldata.cc,
      },
      game: [
        {
          roundId: ri.toString(),
          name: game.gn,
          code: game.gc,
          event: totalReturnToPartner.toFixed(2) <= 0 ? "Lose" : "Won",
        },
      ],
      transaction: {
        id: objDebitTransaction.toString(),
        referenceId: null,
        ticketId: tid,
        amount: Math.abs(totalReturnToPartner.toFixed(2)),
      },
      timestamp: Math.floor(new Date().getTime() / 1000),
    };

    timejson.CreditReq = new Date().toISOString();

    Creditres = await Credit(CreditReq, playerdata.pdata);

    timejson.Creditres = new Date().toISOString();

    if (Creditres.StatusCode === 1) {
      TransactionObj.TransactionType = 3;
      TransactionObj.status = 1;

      objrollbackTransaction = await addTransaction(connection, TransactionObj);

      timejson.objrollbackTransaction = new Date().toISOString();

      Creditres.transaction.referenceId = objrollbackTransaction.toString();
      Creditres.game.event = "cancel";
      rollbackres = await rollback(CreditReq, playerdata.pdata);

      timejson.rollbackres = new Date().toISOString();
    } else if (Creditres.StatusCode === -1) {
      TransactionObj.TransactionType = 3;
      TransactionObj.Status = 1;

      objrollbackTransaction = await addTransaction(connection, TransactionObj);

      if (
        Creditres.transaction === undefined ||
        Creditres.transaction === null
      ) {
        Creditres.transaction = {};
      }

      Creditres.transaction.referenceId = objrollbackTransaction.toString();

      timejson.objrollbackTransaction = new Date().toISOString();

      // Creditres.game.event = "cancel";
      rollbackres = await rollback(CreditReq, playerdata.pdata);

      timejson.rollbackres = new Date().toISOString();
    } else if (Creditres.StatusCode === 0) {
      objupdateTransaction = await updateData1(
        connection,
        "transactions",
        `TransactionId = ${objDebitTransaction}`,
        {
          Status: 200,
        }
      );

      timejson.objupdateTransaction = new Date().toISOString();
    }
  } catch (error) {
    console.error("Error adding transaction:", error);
    throw error;
  } finally {
    /* -------------------------- Create the log object ------------------------- */
    const settlementData = {
      start: `====== Start settlement RoundId : ${ri} =====`,
      playerInfo: `===== PlayerId : ${playerdata.pdata.Pldata.plid}  PlayerName : ${playerdata.pdata.Pldata.pln} =====`,
      insertTransaction: `\t ${
        timejson.TransactionObj
      } : Insert Tran       :  ${JSON.stringify(TransactionObj)}`,
      responseInsertTransaction: `\t ${timejson.objDebitTransaction} : Res Insert Tran   :  ${objDebitTransaction}`,
      requestCredit: `\t ${
        timejson.CreditReq
      } : Request Credit    :  ${JSON.stringify(CreditReq)}`,
      responseCredit: `\t ${
        timejson.Creditres
      } : Response Credit   :  ${JSON.stringify(Creditres)}`,
    };

    if (Creditres.StatusCode === 1 || Creditres.StatusCode === -1) {
      const rollbackdata = {
        start: `====== Start settlement RoundId : ${ri} =====`,
        playerInfo: `===== PlayerId : ${playerdata.pdata.Pldata.plid}  PlayerName : ${playerdata.pdata.Pldata.pln} =====`,
        rollbackTransaction: `\t ${
          timejson.rollbackres
        } : rollback Tran     :  ${JSON.stringify(TransactionObj)}`,
        responseRollbackTransaction: `\t ${timejson.objrollbackTransaction} : Res rollback Tran :  ${objrollbackTransaction}`,
        requestRollback: `\t ${
          timejson.rollbackres
        } : Request rollback  :  ${JSON.stringify(CreditReq)}`,
        responseRollback: `\t ${
          timejson.rollbackres
        } : response rollback :  ${JSON.stringify(rollbackres)}`,
      };

      /* ----------------------------- object log here ---------------------------- */
      await loggerdata(`${Object.values(rollbackdata).join("\n     ")}`);
    } else if (Creditres.StatusCode === 0) {
      const updateData = {
        updateTransaction1: `\t ${timejson.objDebitTransaction} : Update Tran       :  ${objDebitTransaction}`,
        updateTransaction2: `\t ${
          timejson.objupdateTransaction
        } : Update Tran       :  ${JSON.stringify(objupdateTransaction)}`,
      };

      /* ----------------------------- object log here ---------------------------- */
      await loggerdata(
        `${Object.values({ ...settlementData, ...updateData }).join("\n     ")}`
      );
    }
  }

  await loggerdata(`===== END Settlment RoundID : ${ri} =====\n\n`);
}

/* ------------------------------ main function --------------------------- */
async function updatecancelplayer(
  connection,
  ri,
  playerdata,
  game,
  totalReturnToPartner,
  tid
) {
  await loggerdata(`===== Start Settlment RoundID : ${ri} =====`);
  await loggerdata(
    `===== PlayerId : ${playerdata.pdata.Pldata.plid}  PlayerName : ${playerdata.pdata.Pldata.pln} =====`
  );

  const TransactionObj = {
    PlayerId: playerdata.pdata.Pldata.plid,
    PartnerId: playerdata.pdata.Ptdata.ptid,
    TransactionType: 2,
    Amount: totalReturnToPartner.toFixed(2),
    Status: 0,
    RoundId: ri,
    TicketId: null,
    CreatedBy: playerdata.pdata.Pldata.plid,
  };
  await loggerdata(`Insert Tran ${JSON.stringify(TransactionObj)}`);

  const objrollbackTransaction = await addTransaction(
    connection,
    TransactionObj
  );
  await loggerdata(`Res Insert Tran ${objrollbackTransaction}`);

  const CreditReq = {
    player: {
      id: playerdata.pdata.Pldata.pln,
      currency: playerdata.pdata.Pldata.ra,
    },
    game: [
      {
        roundId: ri.toString(),
        name: game.gn,
        code: game.gc,
        event: "cancel",
      },
    ],
    transaction: {
      id: objrollbackTransaction.toString(),
      referenceId: null,
      ticketId: tid,
      amount: Math.abs(totalReturnToPartner.toFixed(2)),
    },
    timestamp: Math.floor(new Date().getTime() / 1000),
  };
  await loggerdata(`Request Credit ${JSON.stringify(CreditReq)}`);

  const Creditres = await Credit(CreditReq, playerdata.pdata);
  await loggerdata(`Response Credit ${JSON.stringify(Creditres)}`);

  if (Creditres.StatusCode === 1) {
    TransactionObj.TransactionType = 3;
    TransactionObj.status = 1;
    await loggerdata(`rollback Tran ${JSON.stringify(TransactionObj)}`);
    const objrrollbacktransaction = await addTransaction(
      connection,
      TransactionObj
    );
    await loggerdata(`Res rollback Tran ${objrrollbacktransaction}`);
    Creditres.transaction.referenceId = objrrollbacktransaction.toString();
    await loggerdata(`Request rollback ${JSON.stringify(CreditReq)}`);
    const rollbackres = await rollback(CreditReq, playerdata.pdata);
    await loggerdata(`response rollback ${JSON.stringify(rollbackres)}`);
  } else if (Creditres.StatusCode === -1) {
    TransactionObj.TransactionType = 3;
    TransactionObj.status = 1;
    await loggerdata(`rollback Tran ${JSON.stringify(TransactionObj)}`);
    const objrrollbacktransaction = await addTransaction(
      connection,
      TransactionObj
    );
    await loggerdata(`Res rollback Tran ${objrrollbacktransaction}`);
    Creditres.transaction.referenceId = objrrollbacktransaction.toString();
    await loggerdata(`Request rollback ${JSON.stringify(CreditReq)}`);
    const rollbackres = await rollback(CreditReq, playerdata.pdata);
    await loggerdata(`response rollback ${JSON.stringify(rollbackres)}`);
  } else if (Creditres.StatusCode === 0) {
    await loggerdata(`Update Tran ${objrollbackTransaction}`);
    const objupdateTransaction = await updateData1(
      connection,
      "transactions",
      `TransactionId = ${objrollbackTransaction}`,
      {
        Status: 200,
      }
    );
    await loggerdata(`Update Tran ${objupdateTransaction}`);
  }

  await loggerdata(
    `===== PlayerId : ${playerdata.pdata.Pldata.plid}  PlayerName : ${playerdata.pdata.Pldata.pln} =====`
  );
  await loggerdata(`===== End Settlment RoundID : ${ri} =====`);
}

/* -------------- Call the fetch data function and send to API -------------- */
fetchDataAndSendToAPI();

console.log("Scheduler started");
