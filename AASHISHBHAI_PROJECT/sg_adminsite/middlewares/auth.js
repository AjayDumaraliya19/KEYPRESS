const { DecryptData, spCall } = require('../models/commonModel');
const mysql = require('mysql2/promise');
// const config = require('../config/mysqlConfig.json')
const { config } = require('../config/connection');
const log4js = require("log4js");
const logger = log4js.getLogger("response");

log4js.configure({

    appenders: {
        out: {
            type: "stdout",
            layout: {
                type: "pattern",
                pattern: "%d %p %c %m %n",
            },
        },
        app: { type: "file", filename: "response.log" }
    },
    categories: { default: { appenders: ["out", "app"], level: "error" } },
});

module.exports = async (req, res, next) => {
    let connection = mysql.createPool(config);
    try {
        const token = req.headers.authorization.split(" ")[1];
        const decryptToken = await DecryptData(token);
        const separateArray = decryptToken.split('/');
        let validateToken = `CALL ValidateToken(?,?,@StatusCode); select @StatusCode as StatusCode`;
        let params = [separateArray[2], separateArray[0]]
        const spResult = await spCall(connection, validateToken, params);
        var userObj = {
            userId: JSON.parse(separateArray[0]),
            token: separateArray[2]
        }
        if (spResult.data[1][0].StatusCode == 0) {
            req.userData = userObj;
            await next();
        } else {
            logger.error({ request: JSON.stringify(req.headers), StatusCode: 8 });
            return res.status(401).json({StatusCode: 8})
        }
    } catch (error) {
         res.status(401).json({
            StatusCode: 2
        })
    } finally {
        connection.end();
    }
}