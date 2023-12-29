import express from "express";
import mysql from "mysql2";
import bodyparser from "body-parser";
import cors from "cors";

const app = express();
const PORT = 8080;

const config = {
  host: "localhost",
  port: 3306,
  user: "root",
  password: "admin",
  database: "casino_dealer",
};

app.use(bodyparser.json());
app.use(cors());

app.listen(PORT, () => {
  console.log(`Server Run at port ${PORT}`);
});

const handlerFunction = async (req, res) => {
  const connection = mysql.createPool(config);
  console.log("database connection..!");
  try {
    const scannedGameId = req.body.GameId;

    // Creatqe Query for get game Code and GameId
    const gameDetailsQuery = `Select * from gameDetails Where code = ?`;
    connection.query(
      gameDetailsQuery,
      [scannedGameId],
      (gameError, gameData) => {
        try {
          const scanGameDetails = gameData[0];

          // Insert New round into the "round" table
          const newRoundQuery = `insert inot round (GameId, Status, IsSettled, IsAvtive, CreateBy, CreateOn) values (?, ?, ?, ?, ?, ?, ?)`;
          const roundData = [scanGameDetails.GameId, 1, 0, 1, null, new Date()];

          connection.query(
            newRoundQuery,
            roundData,
            (roundError, roundData) => {
              try {
                const newRoundId = roundData.roundId;
                const roundUpdate = {
                  ri: newRoundId,
                  gc: scannedGameCode,
                };
                console.log("Round Update Object:", roundUpdate);
              } catch (error) {
                console.log(error, "callbackFun1 error");
              }
            }
          );
        } catch (error) {}
      }
    );
  } catch (error) {
    console.log(error);
  } finally {
    connection.end();
    console.log("database disconnection..!");
  }
};

// Example scanned card data
const cardData = { gameCode: "TP" };

handlerFunction(cardData);



insert into JSON_ARRAYAGG(JSON_OBJECT(
  'rni', RunnerId,
'cr',IFNULL(Cards, ''),
  'sc', Score,
  'ek',ExternalKey
))
FROM runner
WHERE  (GameId = g.GameId AND GroupId = 1)
OR (GameId = g.GameId AND g.Code='AB' AND GroupId IN (1, 5)) 