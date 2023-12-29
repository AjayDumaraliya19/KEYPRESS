/* -------------------------------------------------------------------------- */
/*   Create a "mongoCofig" object in the config folder > connection.js file   */
/* -------------------------------------------------------------------------- */
exports.mongoConfig = {
  url: process.env.MONGODB_URL,
  database: process.env.DATABASE_NAME,
};

/* -------------------------------------------------------------------------- */
/*        This function create in config folde using name "mongodb.js"        */
/* -------------------------------------------------------------------------- */
const { MongoClient } = require("mongodb");
const { mongoConfig } = require("./connection");

/* Connection of the MongoDB Database */
const connectDB = async () => {
  try {
    const client = await MongoClient.connect(mongoConfig.url);
    console.log("MongoDB database connection successfully!");
    return client;
  } catch (error) {
    console.log("MongoDb database connection error : ", error);
  }
};
module.exports = connectDB;

/* -------------------------------------------------------------------------- */
/*    It create in the controller folder using name "logsDataController.js"   */
/* -------------------------------------------------------------------------- */
const { mongoConfig } = require("../config/connection");
const connectDB = require("../config/mongodb");
const logger = require("../middlewares/logger");

/** Get all data from the MongoDB Database */
const GetLogsData = async (req, res) => {
  const connection = await connectDB();
  try {
    const client = await connection.connect();
    const { ri, ptid, plid, pi, ps } = req.body;

    /** Convert String into array from */
    const roundIds = ri.split(",").map((item) => Number(item.trim()));
    const partnerIds = ptid.split(",").map((item) => Number(item.trim()));
    const playerIds = plid.split(",").map((item) => Number(item.trim()));

    /** Set pagination */
    const offSet = (pi - 1) * ps;

    /** Connect database and collection */
    const db = client.db(mongoConfig.database);
    const collection = db.collection("Settlment_logs");

    /** Find filed base on this query */
    const query = {
      $or: [
        { RoundID: { $in: roundIds } },
        { PartnerId: { $in: partnerIds } },
        { PlayerId: { $in: playerIds } },
      ],
    };

    /** Perform operations on the collection */
    const logsList = await collection
      .find(query)
      .skip(offSet)
      .limit(ps)
      .toArray();

    /** Total count of filed in the collection */
    const totalCount = await collection.countDocuments(query);

    res.status(200).send({
      StatusCode: 0,
      TotalRecord: totalCount,
      Data: logsList,
    });
  } catch (error) {
    logger.error({
      StatusCode: 1,
    });
    res.status(401).send({
      StatusCode: 1,
    });
  } finally {
    connection.close();
    console.log("MongoDB Database disconnect..!");
  }
};

module.exports = { GetLogsData };

/* -------------------------------------------------------------------------- */
/*                           create a get LogsRoute                           */
/* -------------------------------------------------------------------------- */
const { GetLogsData } = require("../contorllers/logsDataController");
router.post("/logsdata", auth, GetLogsData);
