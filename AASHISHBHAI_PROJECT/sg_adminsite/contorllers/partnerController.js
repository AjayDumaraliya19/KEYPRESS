const logger = require('../middlewares/logger');
const {
    partnerValidationSchema,
    partnerUpdateValidationSchema,
    partnergamemapValidationSchema,
    partnergamemapUpdateValidationSchema
} = require('../validation');
const validate = require('../middlewares/schemaValidation');
const {
    Eencrypted,
    DecryptData,
    insertData,
    updateData,
    getDataByField,
    getData,
    getMultipleDataInTable, ifExist
} = require('../models/commonModel');
const {
    threeJoins, joinsTwoTb
} = require('../models/joinsQueryModel');
const { wutc } = require('../middlewares/utctime');
const { v4: uuidv4 } = require('uuid');
const mysql = require('mysql2/promise');
const { config } = require('../config/connection');
const tableName = 'partner';
const TableName = 'partnergamemap';

const insertPartner = async (req, res) => {
    let connection = mysql.createPool(config);
    try {
        const uuidToken = uuidv4();
        let validData = await validate(req.body, partnerValidationSchema);
        if (validData !== undefined) {
            logger.error({
                request: JSON.stringify(req.headers),
                message: validData
            });
            return res.status(400).send({
                StatusCode: 15,
                error: validData
            })
        }
        req.body.CreatedBy = req.userData.userId;
        req.body.SecretKey = uuidToken;
        const checkData = await getDataByField(connection, tableName, `Name = '${req.body.Name}' and IsActive = 1 and IsDelete = 0`)
        if (checkData.data[0].length != 0) {
            return res.status(400).send({StatusCode: 9})
        }
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

const updatePartner = async (req, res) => {
    let connection = mysql.createPool(config);
    try {
        let validData = await validate(req.body, partnerUpdateValidationSchema);
        if (validData !== undefined) {
            logger.error({
                request: JSON.stringify(req.headers),
                message: validData
            });
            return res.status(400).send({
                StatusCode: 15,
                error: validData
            })
        }
        const checkData = await getDataByField(connection, tableName, `PartnerId = '${req.params.PartnerId}' and IsActive = 1 and IsDelete = 0`)
        if (checkData.data[0].length == 0) {
            return res.status(400).send({StatusCode: 10})
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

const deletePartner = async (req, res, next) => {
    let connection = mysql.createPool(config);
    try {
        const checkData = await getDataByField(connection, tableName, `PartnerId = '${req.params.PartnerId}' and IsActive = 1 and IsDelete = 0`)
        if (checkData.data[0].length == 0) {
            return res.status(400).send({StatusCode: 10})
        }
        const deleting = await updateData(connection, tableName, req.params, {
            ModifiedBy: req.userData.userId,
            ModifiedOn: await wutc(),
            IsDelete: 1
        });
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

const listPartner = async (req, res) => {
    let connection = mysql.createPool(config);
    try {
        const fields = `PartnerId,Name,SecretKey,WebsiteUrl,IPs,Logo,BalanceApi,DebitApi,CreditApi,RollbackApi,AdminShare,PartnerShare,IsActive+0 AS IsActive,CreatedOn,SettlementType`;
        const list = await getData(connection, tableName, fields, `IsDelete = 0`, req.body.Limit, req.body.Page, req.body);
        if (list.error) {
            return res.status(401).send({StatusCode: 1})
        }
        for (let index = 0; index < list.data.data.length; index++) {
            const encryptdSecretKey = await Eencrypted(list.data.data[index].PartnerId + ":" + list.data.data[index].Name + ":" + list.data.data[index].SecretKey);
            list.data.data[index].SecretKey = encryptdSecretKey;
        }
        res.status(200).send({
            StatusCode: 0,
            TotalRecord: list.data.TotalRecord,
            Data: list.data.data
        })
    } catch (error) {
        logger.error({StatusCode: 1});
        res.status(401).send({StatusCode: 1})
    } finally {
        connection.end();
    }
}


const insertPartnerGame = async (req, res) => {
    let connection = mysql.createPool(config);
    try {
        let validData = await validate(req.body, partnergamemapValidationSchema);
        if (validData !== undefined) {
            logger.error({
                request: JSON.stringify(req.headers),
                message: validData
            });
            return res.status(400).send({
                StatusCode: 15,
                error: validData
            })
        }

        req.body.CreatedBy = req.userData.userId;
        const checkPartner = await getDataByField(connection, 'partner', `PartnerId = '${req.body.PartnerId}' and IsActive = 1 and IsDelete = 0`);
        if(checkPartner.data[0].length == 0){
            return res.status(400).send({StatusCode: 10})
        }
        const checkGame = await getMultipleDataInTable(connection, 'game', `gameID IN (${req.body.GameId}) and IsActive = 1 and IsDelete = 0`);
        if(checkGame.data[0].length == 0) {
            return res.status(400).send({StatusCode: 12})
        }
        // await Promise.all([checkPartner, checkGame]).then((values) => {
        //     if (values[0].data[0].length == 0) {
        //         return res.status(400).send({StatusCode: 10})
        //     }
        //     if (values[1].data[0].length != req.body.GameId.length) {
        //         return res.status(400).send({StatusCode: 12})
        //     }
        // });

        let insertionSuccess = false;
        for (let i of req.body.GameId) {
            if(await ifExist(connection, TableName, `PartnerId = ${req.body.PartnerId} and GameId = ${i} and IsActive = 1 and IsDelete = 0`) == true){
                continue;
            } else {
                req.body.GameId = i;
                const inserting = await insertData(connection, TableName, req.body);
                if (inserting.error) {
                    return res.status(400).send({StatusCode: 1})
                }
                insertionSuccess = true;
            }
        }

        if (insertionSuccess) {
          return res.status(200).send({StatusCode: 5});
        } else {
           return res.status(400).send({StatusCode: 9});
        }
    } catch (error) {
        logger.error({StatusCode: 1});
        res.status(401).send({StatusCode: 1})
    } finally {
        connection.end();
    }
}

const updatePartnerGame = async (req, res) => {
    let connection = mysql.createPool(config);
    try {
        let validData = await validate(req.body, partnergamemapUpdateValidationSchema);
        if (validData !== undefined) {
            logger.error({
                request: JSON.stringify(req.headers),
                message: validData
            });
            return res.status(400).send({
                StatusCode: 15,
                error: validData
            })
        }
        const checkData = await getDataByField(connection, TableName, `PartnerGameMapId = '${req.params.PartnerGameMapId}' and IsDelete = 0`)
        if (checkData.data[0].length == 0) {
            return res.status(400).send({StatusCode: 17})
        }

        req.body.ModifiedBy = req.userData.userId;
        req.body.ModifiedOn = await wutc();
        const updating = await updateData(connection, TableName, req.params, req.body);
        console.log('updating', updating)
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

const deletePartnerGame = async (req, res, next) => {
    let connection = mysql.createPool(config);
    try {
        const checkData = await getDataByField(connection, TableName, `PartnerGameMapId = '${req.params.PartnerGameMapId}' and IsDelete = 0`)
        if (checkData.data[0].length == 0) {
            return res.status(400).send({StatusCode: 17})
        }
        const deleting = await updateData(connection, TableName, req.params, {
            ModifiedBy: req.userData.userId,
            ModifiedOn: await wutc(),
            IsDelete: 1
        });
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

const listPartnerGameByPartnerId = async (req, res) => {
    let connection = mysql.createPool(config);
    try {
        const fields = `A.PartnerGameMapId,A.PartnerId,A.MinStake,A.MaxStake,A.MaxProfit,A.DelaySec,A.IsActive+0 AS IsActive,A.CreatedOn,B.GameId,B.Name`;
        // const ls = await threeJoins(TableName, 'partner', 'game', fields, `B.PartnerId = A.PartnerId`, `C.GameId = A.GameId`, `A.IsDelete = 0`, req.body.Limit, req.body.Page, req.body);

        const list = await joinsTwoTb(connection, TableName, 'game', fields, `B.GameId = A.GameId`, `A.PartnerId = ${req.body.PartnerId} and A.IsDelete = 0`, req.body.Limit, req.body.Page, req.body);
        if (list.error) {
            return res.status(401).send({StatusCode: 1})
        }
        res.status(200).send({
            StatusCode: 0,
            TotalRecord: list.data.TotalRecord,
            Data: list.data.data
        })
    } catch (error) {
        logger.error({StatusCode: 1});
        res.status(401).send({StatusCode: 1})
    } finally {
        connection.end();
    }
}

module.exports = {
    insertPartner,
    updatePartner,
    deletePartner,
    listPartner,
    listPartnerGameByPartnerId,
    deletePartnerGame,
    updatePartnerGame,
    insertPartnerGame
};