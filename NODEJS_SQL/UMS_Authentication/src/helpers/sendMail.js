// const nodemailer = require("nodemailer");
// const config = require("../config/config");

// let transport = nodemailer.createTransport({
//   host: config.email.smtp.host,
//   port: config.email.smtp.port,
//   auth: {
//     user: config.email.smtp.auth.user,
//     pass: config.email.smtp.auth.pass,
//   },
// });

// /** Create send mailer function */
// const sendMail = async (email, mailsubject, content) => {
//   try {
//     return transport.sendMail({
//       from: config.email.from,
//       to: email,
//       subject: mailsubject,
//       html: content,
//     });
//     console.log(`Email send successfully.. :)`);
//   } catch (error) {
//     return false;
//   }
// };

// module.exports = sendMail;

const nodemailer = require("nodemailer");
const config = require("../config/config");

const sendMail = async (email, mailsubject, content) => {
  try {
    const transport = nodemailer.createTransport({
      host: config.email.smtp.host,
      port: config.email.smtp.port,
      secure: false,
      requireTLS: true,
      auth: {
        user: config.email.smtp.auth.user,
        pass: config.email.smtp.auth.pass,
      },
    });

    const mailOptions = {
      from: config.email.from,
      to: email,
      subject: mailsubject,
      html: content,
    };

    transport.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log("Email sent: " + info.response);
      }
    });
  } catch (error) {
    console.log(error.message);
  }
};

module.exports = sendMail;
