var CryptoJS = require("crypto-js");

exports.spCalls = async (connection, validateToken, params) => {
  let obj = {
    error: null,
    data: null,
  };
  try {
    const [rows, fields] = await connection.query(validateToken, params);
    obj.data = rows;
    return obj;
  } catch (error) {
    obj.error = error;
    return obj;
  }
};

exports.spCall = async (connection, validateToken, params) => {
  let obj = {
    error: null,
    data: null,
  };
  try {
    const [rows, fields] = await connection.query(validateToken, params);
    obj.data = rows;
    return obj;
  } catch (error) {
    obj.error = error;
    return obj;
  }
};

exports.getDataByField = async (connection, tableName, query, fields) => {
  let obj = {
    error: null,
    data: null,
  };
  try {
    let sql;
    if (fields === undefined) {
      sql = `select * from ${tableName} where ${query}`;
    } else {
      sql = `select ${fields} from ${tableName} where ${query}`;
    }
    const data = await connection.query(sql);
    obj.data = data;
    return obj;
  } catch (error) {
    obj.error = error;
    return obj;
  }
};

exports.getData = async (
  connection,
  tableName,
  fields,
  whereCondition,
  limit,
  page,
  body
) => {
  let obj = {
    error: null,
    data: null,
  };
  try {
    page = (page - 1) * limit;
    let query = `SELECT ${fields} FROM ${tableName} WHERE ${whereCondition}`;
    let countQuery = `SELECT COUNT(*) AS TotalRecord FROM ${tableName} WHERE ${whereCondition}`;
    let params = [];

    if (body.Search && body.Search.Searchtext) {
      const searchValue = body.Search.Searchtext;
      const searchColumns = body.Search.Column.map(
        (col) => `${col} LIKE ?`
      ).join(" OR ");
      query += ` AND (${searchColumns})`;
      countQuery += ` AND (${searchColumns})`;
      params.push(...body.Search.Column.map(() => `%${searchValue}%`));
    }

    if (body.Sort && body.Sort.Column) {
      const sortColumn = body.Sort.Column;
      const sortOrder = body.Sort.Sortby.toUpperCase();
      query += ` ORDER BY ${sortColumn} ${sortOrder}`;
    }

    query += ` LIMIT ${limit} OFFSET ${page};`;
    params.push(limit, (page - 1) * limit);

    // let sql = `select ${fields} from ${tableName} where ${whereCondition}  LIMIT ${limit} OFFSET ${page}`;
    const data = await connection.query(query, params);
    // let countSql = `SELECT COUNT(*) as TotalRecord FROM ${tableName} WHERE ${whereCondition} `;
    const counts = await connection.query(countQuery, params);
    const result = {
      TotalRecord: counts[0][0].TotalRecord,
      data: data[0],
    };
    obj.data = result;
    return obj;
  } catch (error) {
    console.log("error", error);
    obj.error = error;
    return obj;
  }
};

exports.getDataWithoutPagi = async (connection, tableName, fields, cond1) => {
  let obj = {
    error: null,
    data: null,
  };
  try {
    let sql = `select ${fields} from ${tableName} where ${cond1}`;
    const data = await connection.query(sql);
    obj.data = data;
    return obj;
  } catch (error) {
    obj.error = error;
    return obj;
  }
};

exports.ifExist = async (connection, tableName, cond1) => {
  try {
    let sql = `select 1 from ${tableName} where ${cond1}`;
    console.log(sql);
    const data = await connection.query(sql);
    let exists = data[0].length ? true : false;
    console.log(exists);
    return exists;
  } catch (error) {
    return error;
  }
};

exports.insertData = async (connection, tableName, insertData) => {
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
};

exports.updateData = async (connection, tableName, query, updateData) => {
  let obj = {
    error: null,
    data: null,
  };
  try {
    let sql = `UPDATE ${tableName} set ? where ${Object.keys(query)[0]} = '${
      Object.values(query)[0]
    }'`;
    const data = await connection.query(sql, [updateData]);
    obj.data = data;
    return obj;
  } catch (error) {
    obj.error = error;
    return obj;
  }
};

exports.updateData1 = async (connection, tableName, query, updateData) => {
  let obj = {
    error: null,
    data: null,
  };
  try {
    let sql = `UPDATE ${tableName} set ? where ${query}`;
    const data = await connection.query(sql, [updateData]);
    obj.data = data;
    return obj;
  } catch (error) {
    obj.error = error;
    return obj;
  }
};

exports.updateTwoTbl = async (
  connection,
  tb1,
  tb2,
  whereCondition,
  updateData
) => {
  let obj = {
    error: null,
    data: null,
  };
  try {
    let sql = `UPDATE ${tb1} AS t1 JOIN ${tb2} AS t2 ON t1.GameId = t2.GameId SET ? WHERE  t1.${
      Object.keys(whereCondition)[0]
    } = '${Object.values(whereCondition)[0]}'`;
    const data = await connection.query(sql, [updateData]);
    obj.data = data;
    return obj;
  } catch (error) {
    obj.error = error;
    return obj;
  }
};

exports.getMultipleDataInTable = async (connection, tableName, query) => {
  let obj = {
    error: null,
    data: null,
  };
  try {
    let sql = `SELECT gameID FROM ${tableName} WHERE ${query}`;
    const data = await connection.query(sql);
    obj.data = data;
    return obj;
  } catch (error) {
    obj.error = error;
    return obj;
  }
};

exports.Encrypt = async (strText) => {
  if (strText == null || strText == "") {
    return strText;
  } else {
    const IV = [0x12, 0x34, 0x56, 0x78, 0x90, 0xab, 0xcd, 0xef];
    const strEncrKey = "&%#@?,:*";
    const encrypted = CryptoJS.DES.encrypt(strText, strEncrKey, IV);
    console.log(encrypted.toString());
    return encrypted.toString();
  }
};

exports.decryptString = async (encryptedString) => {
  const strEncrKey = "&%#@?,:*";
  const IV = [0x12, 0x34, 0x56, 0x78, 0x90, 0xab, 0xcd, 0xef];
  const decryptedBytes = CryptoJS.DES.decrypt(encryptedString, strEncrKey, IV);
  const decryptedString = decryptedBytes.toString(CryptoJS.enc.Utf8);
  console.log(decryptedString);
  return decryptedString;
};

exports.Eencrypted = async (data) => {
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
};

exports.DecryptData = async (data) => {
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
};
