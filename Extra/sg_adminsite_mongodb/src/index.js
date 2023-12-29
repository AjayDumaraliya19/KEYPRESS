import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import routes from "./routes/routes.js";
import config from "./config/config.js";
import logger from "./middlewares/logger.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
    return res.status(200).json({});
  }
  next();
});

app.use("/", routes);

app.use((req, res, next) => {
  logger.error({ request: JSON.stringify(req.headers), message: res.data });
  res.status(400).send({
    StatusCode: 1,
    ErrorMessage: "Bad Request",
  });
  return next();
});

app.listen(config.port, () => {
  console.log(`Created server on port http://localhost:${config.port}`);
});
