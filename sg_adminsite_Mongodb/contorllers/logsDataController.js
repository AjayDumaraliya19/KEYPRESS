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
