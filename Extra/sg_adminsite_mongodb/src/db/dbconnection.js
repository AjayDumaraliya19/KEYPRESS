import { MongoClient } from "mongodb";
import config from "../config/config.js";

/* ----------------------- Create connection function ----------------------- */
const DBconnection = async (req, res) => {
  try {
    const client = new MongoClient(config.mongodb.url, config.mongodb.Option);

    await client.connect();

    res.status(200).send({
      StatusCode: 0,
      message: `Connecto to database successfully..!`,
    });
    return client;
  } catch (err) {
    logger.error({
      request: JSON.stringify(req.headers),
      message: err,
    });
    res.status(400).send({
      StatusCode: 15,
      error: `Database connection error..!`,
    });
  }
};

export default DBconnection;
