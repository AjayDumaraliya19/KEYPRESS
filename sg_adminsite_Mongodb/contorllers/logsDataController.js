const connectDB = require("../config/mongodb");
const { mongoConfig } = require("../config/connection");

/** Get all data from the MongoDB Database */
const GetAllLogsData = async (req, res) => {
  try {
    const client = await connectDB();

    /** Database and Collection coneection */
    const db = client.db(mongoConfig.database);
    const collection = client.collection("SG_data");

    /** Perform operations on the collection */
    const logsList = await client.find({}).toArray();

    console.log("Documents:", logsList);

    res.status(200).send({
      StatusCode: 0,
      Data: logsList,
    });
  } catch (error) {
    res.status(401).send({
      StatusCode: 1,
    });
  }
};

/** Get all data from the MongoDB Database */
const GetLogsData = async (req, res) => {
  try {
    const client = await connectDB();
    const { ri, pid, plid, ptid } = req.body;

    /** Perform operations on the collection */
    const logsList = await client
      .find({
        $and: [{ ri: ri }, { pid: pid }, { plid: plid }],
      })
      .toArray();

    console.log("logslist:", logsList);

    res.status(200).send({
      StatusCode: 0,
      logsList,
    });
  } catch (error) {
    res.status(401).send({
      StatusCode: 1,
    });
  }
};

module.exports = { GetAllLogsData, GetLogsData };
