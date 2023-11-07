const pool = require("../db/dbconnection");

const creatTable = pool.connect(function (err) {
  if (err) {
    return console.error("error: " + err.message);
  }

  let createTodos = `CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    firstName VARCHAR(50) NOT NULL,
    lastName VARCHAR(50),
    email VARCHAR(128) UNIQUE NOT NULL,
    password VARCHAR(64) NOT NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
  )`;

  pool.query(createTodos, function (err, results, fields) {
    if (err) {
      console.log(err.message);
    }
  });

  pool.end(function (err) {
    if (err) {
      return console.log(err.message);
    }
  });
});

module.exports = creatTable;
