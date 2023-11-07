var CryptoJS = require("crypto-js");
const axios = require("axios");

// exports.addTransaction = async (connection, TransactionObj) => {
const addTransaction = async (connection, TransactionObj) => {
  try {
    const addTransaction = await insertData(
      connection,
      "transactions",
      TransactionObj
    );
    return addTransaction.data[0].insertId;
  } catch (error) {
    console.error("Error adding transaction:", error);
    throw error;
  }
  const addTransaction = await insertData(
    connection,
    "transactions",
    TransactionObj
  );
  return addTransaction.data[0].insertId;
};

// exports.updateTransaction = async (
const updateTransaction = async (
  connection,
  res,
  TransactionId,
  objupdateTransaction
) => {
  const updateTransaction = await updateData1(
    connection,
    tb2,
    `TransactionId = ${TransactionId}`,
    objupdateTransaction
  );
  console.log("updateTransaction", updateTransaction);
  if (updateTransaction.error) {
    return res.status(200).send({
      StatusCode: 1,
    });
  }
  console.log("updateTransaction", updateTransaction);
  return 0;
};

async function insertData(connection, tableName, insertData) {
  let obj = {
    error: null,
    data: null,
  };
  try {
    let sql = `INSERT INTO ${tableName} set ?`;
    const data = await connection.query(sql, [insertData]);
    obj.data = data;
    return obj;
  } catch (error) {
    obj.error = error;
    return obj;
  }
}

// exports.updateData1 = async (connection, tableName, query, updateData) => {
const updateData1 = async (connection, tableName, query, updateData) => {
  let obj = {
    error: null,
    data: null,
  };
  try {
    connection = mysql.createPool(config);
    let sql = `UPDATE ${tableName} set ? where ${query}`;
    const data = await connection.query(sql, [updateData]);
    console.log(sql);
    obj.data = data;
    return obj;
  } catch (error) {
    obj.error = error;
    return obj;
  }
};

// exports.Credit = async (req, pdata) => {
const Credit = async (req, pdata) => {
  try {
    const sessionId = await Eencrypted(
      pdata.Pldata.plid + "/" + pdata.Pldata.pln + "/" + pdata.Pldata.plst
    );
    const partnerKey = await Eencrypted(
      pdata.Ptdata.ptid + "/" + pdata.Ptdata.ptn + "/" + pdata.Ptdata.plsk
    );
    console.log(sessionId, partnerKey);

    let option = {
      method: "post",
      timeout: 8000,
      url: pdata.Ptdata.ca,
      headers: {
        sessionId: sessionId,
        partnerKey: partnerKey,
      },
      data: req,
    };
    console.log("Player Data", JSON.stringify(option));
    var Creditres = await axios(option);
    // console.log('res credit ', Creditres)
    if (Creditres.data.status.code != "SUCCESS") {
      return {
        StatusCode: -1,
        StatusMessage: Creditres.data.status.messge,
      };
    } else {
      return {
        StatusCode: 0,
        StatusMessage: Creditres.data.status.messge,
      };
    }
  } catch (error) {
    console.log("error ", error);
    return {
      StatusCode: 1,
      StatusMessage: error,
    };
  }
};

// exports.rollback = async (authorization, req, partnerData) => {
const rollback = async (authorization, req, partnerData) => {
  try {
    console.log("rollbackData", partnerData.data.data[0]);
    const key =
      partnerData.data.data[0].PartnerId +
      "/" +
      partnerData.data.data[0].PartnerName +
      "/" +
      partnerData.data.data[0].SecretKey;
    const partnerKey = await Eencrypted(key);
    let option = {
      method: "post",
      url: partnerData.data.data[0].RollbackApi,
      headers: {
        sessionId: authorization,
        partnerKey: partnerKey,
      },
      data: req,
    };
    console.log("rollback axios", JSON.stringify(option));
    var rollbackres = await axios(option);
    if (rollbackres.data.status.code != "SUCCESS") {
      return {
        StatusCode: -1,
        StatusMessage: rollbackres.data.status.messge,
      };
    } else {
      return {
        StatusCode: 0,
        StatusMessage: rollbackres.data.status.messge,
      };
    }
  } catch (error) {
    return {
      StatusCode: 1,
      StatusMessage: error.statusMessage,
    };
  }
};

async function Eencrypted(data) {
  var key = CryptoJS.enc.Utf8.parse("acg7ay8h447825cg");
  var iv = CryptoJS.enc.Utf8.parse("8080808080808080");
  var EencryptedData = CryptoJS.AES.encrypt(
    CryptoJS.enc.Utf8.parse(data),
    key,
    {
      keySize: 128 / 8,
      iv: iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    }
  ).toString();
  return EencryptedData;
}

async function DecryptData(data) {
  if (data) {
    data = decodeURIComponent(data);
    var key = CryptoJS.enc.Utf8.parse("acg7ay8h447825cg");
    var iv = CryptoJS.enc.Utf8.parse("8080808080808080");
    var DecryptedSession = CryptoJS.AES.decrypt(data, key, {
      keySize: 128 / 8,
      iv: iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    }).toString(CryptoJS.enc.Utf8);
    return DecryptedSession;
  } else {
    return "";
  }
}

/** Exports all data modules here */
module.exports = {
  addTransaction,
  updateTransaction,
  rollback,
  Credit,
  updateData1,
};
