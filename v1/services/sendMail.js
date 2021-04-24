// include nodemailer
const nodemailer = require("nodemailer");
require("dotenv").config();

let sendMail = async (toMail, subject, body) => {
  let fromMail = process.env.EMAIL_AUTH_FROMMAIL;
  // auth
  const transporter = nodemailer.createTransport({
    service: process.env.EMAIL_AUTH_SERVICE,
    auth: {
      user: process.env.EMAIL_AUTH_USER,
      pass: process.env.EMAIL_AUTH_PASS,
    },
  });

  // email options
  let mailOptions = {
    from: fromMail,
    to: toMail,
    subject: subject,
    html: body,
  };

  // send email
  let response = await transporter.sendMail(mailOptions);
  return response;
};

module.exports = sendMail;
