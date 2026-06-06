const nodemailer = require("nodemailer");
const env = require("./env");

const transporter = nodemailer.createTransport({
  host: env.SMTP_HOST,
  port: Number(env.SMTP_PORT),
  secure: false,
  auth: {
    user: env.SMTP_USER,
    pass: env.SMTP_PASS,
  },
});

const sendMail = async ({ to, subject, html, text }) => {
  return transporter.sendMail({
    from: env.MAIL_FROM,
    to,
    subject,
    html,
    text,
  });
};

module.exports = sendMail;
