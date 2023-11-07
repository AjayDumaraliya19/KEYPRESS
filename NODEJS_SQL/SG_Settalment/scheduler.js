// const cron = require("node-cron");
const mysql = require("mysql2/promise");
const { loggerdata } = require("./logger");

const {
  addTransaction,
  updateTransaction,
  rollback,
  Credit,
  updateData1,
} = require("./Comman");

/** Create a connection pool */
const pool = mysql.createPool({
  host: "51.11.109.36",
  port: 3306,
  user: "admin1",
  password: "admin@sql#2025",
  database: "Casino_Dealer",
  multipleStatements: true,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

/** Define a function to call the stored procedure and send the data to the REST API */
async function fetchDataAndSendToAPI() {
  try {
    /** Acquire a connection from the pool */
    const connection = await pool.getConnection();
    // await loggerdata(`Response Credit`);

    /** Call the stored procedure to fetch data */
    // const [rows, fields] = await connection.execute(
    //   "CALL Casino_Dealer.Player_Settlement()"
    // );

    // const data = rows[0]; // Adjust this based on the structure of your stored procedure's result

    const data = [
      {
        ri: 10966,
        Status: 3,
        winlist: [
          { gri: 1, rni: 1 },
          { gri: 2, rni: 4 },
        ],
        playerlist: [
          {
            ce: -20,
            tl: [
              { pl: -10, tid: 361, isWon: 0 },
              { pl: 10, tid: 362, isWon: 1 },
              { pl: -10, tid: 363, isWon: 0 },
              { pl: -10, tid: 364, isWon: 0 },
            ],
            pid: 1,
            pdata: {
              Pldata: {
                cc: "AUD",
                pln: "Ap11",
                plid: 1,
                plst: "bdf2ed4f-8e7e-4c4a-b354-ec2269199f4d",
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

    console.log(JSON.stringify(data));

    await updateRound(connection, data);
    /** Make a REST API request to send the data */
    // const response = await axios.post('https://your-api-endpoint', data);
    // console.log('Data sent to API:', response.data);

    /** Release the connection back to the pool */
    connection.release();
    await new Promise((resolve) => setTimeout(resolve, 5000));

    fetchDataAndSendToAPI();
  } catch (error) {
    console.error(
      "Error fetching data from the database or sending data to API:",
      error
    );
  }
}

// Schedule the function to run every 1 second using node-cron
// cron.schedule('* * * * * *', () => {
//
//
// });

async function updateRound(connection, data) {
  await data.forEach(async (rounddata) => {
    // console.log(JSON.stringify(rounddata));
    await rounddata.playerlist.forEach(async (playerdata) => {
      // console.log(JSON.stringify(playerdata));
      await SendToPartner(
        connection,
        rounddata.ri,
        rounddata.Status,
        playerdata,
        rounddata.Game
      );
    });
  });
}

async function SendToPartner(connection, ri, Status, playerdata, game) {
  // console.log(ri, JSON.stringify(playerdata));
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
      // console.log(`totalReturnToPartner ${playerdata.pid} ${playerdata.ptid}`, totalReturnToPartner.toFixed(2));
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

    // console.log('Req TransactionObj', JSON.stringify(TransactionObj))
    objDebitTransaction = await addTransaction(connection, TransactionObj);

    timejson.objDebitTransaction = new Date().toISOString();
    // console.log('Res TransactionObj', objDebitTransaction)

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

    // console.log('Req Credit', JSON.stringify(CreditReq))
    Creditres = await Credit(CreditReq, playerdata.pdata);

    timejson.Creditres = new Date().toISOString();

    // console.log('Res Credit', JSON.stringify(Creditres))
    if (Creditres.StatusCode === 1) {
      TransactionObj.TransactionType = 3;
      TransactionObj.status = 1;

      // console.log('roll back TransactionObj', TransactionObj)
      objrollbackTransaction = await addTransaction(connection, TransactionObj);

      timejson.objrollbackTransaction = new Date().toISOString();

      Creditres.transaction.referenceId = objrollbackTransaction.toString();
      Creditres.game.event = "cancel";
      rollbackres = await rollback(CreditReq, playerdata.pdata);

      timejson.rollbackres = new Date().toISOString();
    } else if (Creditres.StatusCode === -1) {
      TransactionObj.TransactionType = 3;
      TransactionObj.status = 1;
      // console.log('roll back TransactionObj', TransactionObj)
      objrollbackTransaction = await addTransaction(connection, TransactionObj);

      Creditres.transaction.referenceId = objrollbackTransaction.toString();

      timejson.objrollbackTransaction = new Date().toISOString();

      Creditres.game.event = "cancel";
      rollbackres = await rollback(CreditReq, playerdata.pdata);

      timejson.rollbackres = new Date().toISOString();

      // console.log('rollbackres tes', rollbackres);
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

      // console.log('sucsess res', Creditres);
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

  //console.log('Req TransactionObj', JSON.stringify(TransactionObj))
  const objrollbackTransaction = await addTransaction(
    connection,
    TransactionObj
  );
  // console.log('Res TransactionObj', objrollbackTransaction)
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

  // console.log('Req Credit', JSON.stringify(CreditReq))
  const Creditres = await Credit(CreditReq, playerdata.pdata);
  await loggerdata(`Response Credit ${JSON.stringify(Creditres)}`);

  // console.log('Res Credit', JSON.stringify(Creditres))
  if (Creditres.StatusCode === 1) {
    TransactionObj.TransactionType = 3;
    TransactionObj.status = 1;
    await loggerdata(`rollback Tran ${JSON.stringify(TransactionObj)}`);
    //console.log('roll back TransactionObj', TransactionObj)
    const objrrollbacktransaction = await addTransaction(
      connection,
      TransactionObj
    );
    await loggerdata(`Res rollback Tran ${objrrollbacktransaction}`);
    Creditres.transaction.referenceId = objrrollbacktransaction.toString();
    await loggerdata(`Request rollback ${JSON.stringify(CreditReq)}`);
    const rollbackres = await rollback(CreditReq, playerdata.pdata);
    await loggerdata(`response rollback ${JSON.stringify(rollbackres)}`);
    //  console.log('rollbackres tes', rollbackres);
  } else if (Creditres.StatusCode === -1) {
    TransactionObj.TransactionType = 3;
    TransactionObj.status = 1;
    //  console.log('roll back TransactionObj', TransactionObj)
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
    //  console.log('rollbackres tes', rollbackres);
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
    //console.log('sucsess res', Creditres);
  }

  await loggerdata(
    `===== PlayerId : ${playerdata.pdata.Pldata.plid}  PlayerName : ${playerdata.pdata.Pldata.pln} =====`
  );
  await loggerdata(`===== End Settlment RoundID : ${ri} =====`);
}

fetchDataAndSendToAPI();
console.log("Scheduler started");
