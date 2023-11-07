const express = require("express");
const sql = require("mysql2");
const colors = require("colors");

const app = express();

/* ------------------------- Allow data-form In json ------------------------ */
app.use(express.json());

/* ------------------------- Create connection pool ------------------------- */
const pool = sql.createConnection({
  host: "127.0.0.1",
  port: 3306,
  user: "root",
  password: "Admin",
  database: "emp",
});

/* ---------------------------- Connected or not ---------------------------- */
pool.connect((err) => {
  if (err) {
    console.log(`Connection error : ${err} `.bgRed);
  } else {
    console.log("SQL Database connection successfully...!".bgGreen);
  }
});

/* ------------------------------ Create route ------------------------------ */
/** Create post route here */
app.post("/create", (req, res) => {
  const data = req.body;
  pool.query("INSERT INTO emp.employees SET ?", data, (err, result, fields) => {
    if (err) {
      console.log(`Inserting data error : ${err}`);
    } else {
      res.send(`Data inserted Successfully : ${JSON.stringify(result)}`);
      console.log(result);
      pool.end();
    }
  });
});

/** Create Get routes here */
app.get("/get", (req, res) => {
  pool.query("SELECT * FROM emp.employees", (err, results) => {
    if (err) {
      res.send(`Qeury Error ${err}`);
    } else {
      res.send(results);
      console.log(`Query result ${JSON.stringify(results)}`.cyan);
      pool.end();
    }
  });
});

/** Update data */
app.put("/update/:id", (req, res) => {
  const data = [
    req.body.emp_name,
    req.body.age,
    req.body.gender,
    req.body.DOJ,
    req.body.dept,
    req.body.city,
    req.body.salary,
    req.params.id,
  ];
  pool.query(
    "UPDATE emp.employees SET emp_name=?, age=?, gender=?, DOJ=?, dept=?, city=?, salary=? WHERE id=?",
    data,
    (err, result, fields) => {
      if (err) {
        res.send(`Update Data error : ${err}`);
      } else {
        res.send(result);
        console.log("Data update successfully!", result);
      }
    }
  );
});

/** Delete Data */
app.delete("/delete/:id", (req, res) => {
  pool.query(
    `DELETE FROM emp.employees WHERE id=${req.params.id}`,
    (err, result, fields) => {
      if (err) {
        res.send(`Your data is not deleted ${err}`);
      } else {
        res.send(`Your data ${JSON.stringify(result)} deleted successfully..!`);
        console.log("Delete data successfully...!".bgBlue);
      }
    }
  );
});

/* ----------------------- Create server using express ---------------------- */
app.listen(8000, () => {
  console.log("Server is running on port 8000...!".bgCyan.black);
});
