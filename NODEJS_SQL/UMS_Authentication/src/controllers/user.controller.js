const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const randomString = require("randomstring");
const db = require("../db/dbconnection");
const sendMail = require("../helpers/sendMail");

/** Create user register controller */
const register = (req, res) => {
  const err = validationResult(req);

  if (!err.isEmpty()) {
    return res.status(400).json({ error: err.array() });
  }

  db.query(
    `SELECT * FROM users WHERE LOWER(email) = LOWER("${db.escape(
      req.body.email
    )}")`,
    (err, result) => {
      if (result && result.length) {
        return res.status(409).json({
          success: false,
          message: "Email already exists",
        });
      } else {
        bcrypt.hash(req.body.password, 10, (err, hash) => {
          if (err) {
            return res.status(400).json({
              success: false,
              message: err?.message || "Somthing is wrong..!",
            });
          } else {
            db.query(
              `INSERT INTO users (name, email, password) VALUES ("${
                req.body.name
              }", "${db.escape(req.body.email)}", "${db.escape(hash)}")`,
              (err, result) => {
                if (err) {
                  return res.status(400).json({
                    success: false,
                    message: err?.message || "Somthing is wrong..!",
                  });
                }

                let mailsubject = "Email Verification..!";
                const randomToken = randomString.generate();
                let content = `
                <P>Hii "${req.body.name}",
                Please <a href="http://127.0.0.1:8080/mail-varification?token='${randomToken}'"> Verify</a> your email.
                `;
                sendMail(req.body.email, mailsubject, content);

                db.query(
                  `UPDATE users SET token=? WHERE email=?`,
                  [randomToken, req.body.email],
                  function (err, result) {
                    if (err) {
                      return res.status(400).json({
                        success: false,
                        message: err?.message || "Somthing is wrong..!",
                      });
                    }
                  }
                );

                return res.status(200).json({
                  success: true,
                  message: "User has been registered with us :)",
                });
              }
            );
          }
        });
      }
    }
  );
};

/** Exports all data modules here */
module.exports = { register };
