const { mongoConfig } = require("../config/connection");
const connectDB = require("../config/mongodb");

/** Get all data from the MongoDB Database */
const GetLogsData = async (req, res) => {
  try {
    const client = await connectDB();
    const { ri, pid, plid, ptid } = req.body;

    /** Connect database and collection */
    const db = client.db(mongoConfig.database);
    const collection = db.collection("SG_data");

    /** Perform operations on the collection */
    const logsList = await collection
      .find({
        $and: [
          { ri: ri },
          { pid: pid },
          { plid: plid },
          { "req.data.Ptdata.ptid": ptid },
        ],
      })
      .toArray();

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

module.exports = { GetLogsData };
