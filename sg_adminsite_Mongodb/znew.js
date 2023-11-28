/* ------------------------------------ 1 ----------------------------------- */
// require("dotenv").config();
// const log4js = require("log4js");
// const logger = log4js.getLogger();
// const fs = require("fs");
// const { mogoConfig } = require("../config/connection");
// const MongoClient = require("mongodb").MongoClient;

// /** Configure log4js to write logs to a file */
// log4js.configure({
//   appenders: {
//     fileAppender: { type: "file", filename: "response.log" },
//   },
//   categories: {
//     default: { appenders: ["fileAppender"], level: "error" },
//   },
// });

// /** Watch the log file and push new logs to MongoDB */
// function watchLogFileAndPushToMongoDB() {
//   fs.watchFile(
//     "response.log",
//     { persistent: true, interval: 500 },
//     async () => {
//       const logContent = fs.readFileSync("response.log", "utf8");
//       const logsArray = logContent.split("\n");

//       try {
//         const client = await MongoClient.connect(
//           process.env.MONGODB_URL || mogoConfig.url
//         );
//         const db = client.db(process.env.DATABASE_NAME || mogoConfig.database);
//         const collection = db.collection(
//           process.env.COLLECTION_NAME || mogoConfig.collection
//         );

//         for (const log of logsArray) {
//           if (log.trim().length > 0) {
//             /** Here, you can format the log entry from the log file as needed before inserting it into MongoDB */
//             await collection.insertOne({ log });
//           }
//         }

//         client.close();
//       } catch (err) {
//         console.error("Error pushing logs to MongoDB:", err);
//       }
//     }
//   );
// }

// /** Start watching the log file and pushing logs to MongoDB */
// watchLogFileAndPushToMongoDB();

// module.exports = logger;
/* ------------------------------------ 1 ----------------------------------- */

/* ------------------------------------ 2 ----------------------------------- */
// const Logsdata = require("../models/logsdataModel");
// const { collection } = require("../config/mongodb");

// const GetLogsData = async (req, res) => {
//   try {
//     const { ri, plid, ptid, toDate, fromDate } = req.query;

//     // Define your query based on provided criteria
//     const query = {
//       ri: Number(ri),
//       plid: Number(plid),
//       ptid: Number(ptid),
//       td: { $gte: new Date(toDate), $lte: new Date(fromDate) }
//     };

//     const result = await collection.find(query).toArray();

//     res.status(200).json({
//       message: "Successfully fetched logs data",
//       data: result,
//     });
//   } catch (error) {
//     console.error("Error fetching logs data:", error);
//     res.status(500).json({ message: "Internal server error" });
//   }
// };

// module.exports = { GetLogsData };
/* ------------------------------------ 2 ----------------------------------- */

// const { GetLogsdataSchema } = require("../validation");

// const validateLogsData = (req, res, next) => {
//   const { error } = GetLogsdataSchema.validate(req.body);
//   if (error) {
//     return res.status(400).json({ message: error.details[0].message });
//   }
//   next();
// };
// module.exports = { validateLogsData };

// const express = require("express");
// const router = express.Router();
// const logsDataController = require("../controllers/logsDataController");
// const { validateLogsData } = require("../middlewares/validationMiddleware");
// // Route to get logs data
// router.get("/logsdata", logsDataController.GetLogsData);
// router.post("/logsdata", validateLogsData, logsDataController.GetLogsData); // POST endpoint for data in request body
// module.exports = router;

// const Joi = require("joi");
// const Logsdata = require("../models/logsdataModel");
// const { collection } = require("../config/mongodb");
// const { GetLogsdataSchema } = require("../validation");
// const GetLogsData = async (req, res) => {
//   try {
//     // Validate request body
//     const { error, value } = GetLogsdataSchema.validate(req.body);
//     if (error) {
//       return res.status(400).json({ message: error.details[0].message });
//     }

//     // Extract validated data from request body
//     const { ri, plid, ptid, toDate, fromDate } = value;

//     // Define your query based on provided criteria
//     const query = {
//       ri: Number(ri),
//       plid: Number(plid),
//       ptid: Number(ptid),
//       td: { $gte: new Date(toDate), $lte: new Date(fromDate) },
//     };

//     const result = await collection.find(query).toArray();

//     res.status(200).json({
//       message: "Successfully fetched logs data",
//       data: result,
//     });
//   } catch (error) {
//     console.error("Error fetching logs data:", error);
//     res.status(500).json({ message: "Internal server error" });
//   }
// };

// module.exports = { GetLogsData };

// const Joi = require("joi");

// exports.GetLogsdataSchema = Joi.object({
//   ri: Joi.number().required(),
//   plid: Joi.number().required(),
//   ptid: Joi.number().required(),
//   toDate: Joi.date().required(),
//   fromDate: Joi.date().required(),
// });
