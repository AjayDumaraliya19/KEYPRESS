const logger = require('../middlewares/logger');
const { runnerValidationSchema, runnerUpdateValidationSchema } = require('../validation');
const validate = require('../middlewares/schemaValidation');
const { insertData, getDataByField, updateData,spCall } = require('../models/commonModel');
const { wutc } = require('../middlewares/utctime');
const mysql = require('mysql2/promise');
const { config } = require('../config/connection');
let tableName = 'runner';

const insertRunner = async (req, res) => {
    let connection = mysql.createPool(config);
    try {
        let validData = await validate(req.body, runnerValidationSchema);
        if (validData !== undefined) {
            logger.error({ request: JSON.stringify(req.headers), message: validData });
            return res.status(400).send({
                StatusCode: 15,
                error: validData
            })
        }
        req.body.CreatedBy = req.userData.userId;
        const inserting = await insertData(connection, tableName, req.body);
        if (inserting.error) {
            return res.status(400).send({StatusCode: 1})
        }
        res.status(200).send({StatusCode: 5})
    } catch (error) {
        logger.error({StatusCode: 1});
        res.status(401).send({StatusCode: 1})
    } finally {
        connection.end();
    }
}

const updateRunner = async (req, res) => {
    let connection = mysql.createPool(config);
    try {
        const checkData = await getDataByField(connection, tableName, `RunnerId = '${req.params.RunnerId}' and IsDelete = 0`)
        if (checkData.data[0].length == 0) {
            return res.status(400).send({StatusCode: 19})
        }
        let validData = await validate(req.body, runnerUpdateValidationSchema);
        if (validData !== undefined) {
            logger.error({ request: JSON.stringify(req.headers), message: validData });
            return res.status(400).send({
                StatusCode: 15,
                error: validData
            })
        }
        req.body.ModifiedBy = req.userData.userId;
        req.body.ModifiedOn = await wutc();
        const updating = await updateData(connection, tableName, req.params, req.body);
        if (updating.error) {
            return res.status(400).send({StatusCode: 1})
        }
        res.status(200).send({StatusCode: 6})
    } catch (error) {
        logger.error({StatusCode: 1});
        res.status(401).send({StatusCode: 1})
    } finally {
        connection.end();
    }
}

const deleteRunner = async (req, res, next) => {
    let connection = mysql.createPool(config);
    try {
        const checkData = await getDataByField(connection, tableName, `RunnerId = '${req.params.RunnerId}' and IsDelete = 0`)
        if (checkData.data[0].length == 0) {
            return res.status(400).send({StatusCode: 19})
        }
        const deleting = await updateData(connection, tableName, req.params, { ModifiedBy: req.userData.userId, ModifiedOn: await wutc(), IsDelete: 1 });
        if (deleting.error) {
            return res.status(401).send({StatusCode: 1})
        }
        res.status(200).send({StatusCode: 7})
    } catch (error) {
        logger.error({StatusCode: 1});
        res.status(401).send({StatusCode: 1})
    } finally {
        connection.end();
    }
}


const listRunnerByGameId = async (req, res) => {
    let connection = mysql.createPool(config);
    try {
        const fields = `RunnerId,GameId,Name,BackOdd,LayOdd,GroupId,Rcode,IsActive+0 AS IsActive,CreatedOn,IsShow`;
        const list = await getDataByField(connection, tableName, `GameId = ${req.params.GameId} and IsDelete = 0`, fields);
        if (list.error) {
            return res.status(401).send({StatusCode: 1})
        }
        res.status(200).send({
            StatusCode: 0,
            Data: list.data[0]
        })
    } catch (error) {
        logger.error({StatusCode: 1});
        res.status(401).send({StatusCode: 1})
    } finally {
        connection.end();
    }
}


const Getallrunner = async (req, res, next) => {
    let connection = mysql.createPool(config);
    try {
        
        let Rd = `call Casino_Dealer.admin_Getallrunner()`;
        let spResult = await spCall(connection, Rd);

        if (spResult.error != null) {
            return res.status(401).send({
                StatusCode: 4
            })
        }
        res.status(200).json({
            StatusCode: 0,
            Data: spResult.data[0]
        })
    } catch (error) {
        console.log('error', error)
        res.status(401).send({
            StatusCode: 1
        })
    } finally {
        connection.end();
    }
}

module.exports = { insertRunner, updateRunner, deleteRunner, listRunnerByGameId ,Getallrunner};